package com.feastflow.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.feastflow.enums.ReservationStatus;
import com.feastflow.model.Customer;
import com.feastflow.model.Reservation;
import com.feastflow.model.RestaurantTable;
import com.feastflow.repository.ICustomerRepository;
import com.feastflow.repository.IReservationRepository;
import com.feastflow.repository.IRestaurantTableRepository;
import com.feastflow.service.IReservationService;

@Service
@Transactional
public class ReservationService implements IReservationService {

    private final IReservationRepository reservationRepo;
    private final ICustomerRepository customerRepo;
    private final IRestaurantTableRepository tableRepo;

    public ReservationService(IReservationRepository reservationRepo,
                              ICustomerRepository customerRepo,
                              IRestaurantTableRepository tableRepo) {
        this.reservationRepo = reservationRepo;
        this.customerRepo = customerRepo;
        this.tableRepo = tableRepo;
    }

    @Override
    public Reservation create(String customerEmail, String tableId, LocalDateTime time, int guests, String specialRequest) {
        if (time.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reservation time must be in the future");
        }
        // Normalize to 5-minute precision (optional)
        time = time.truncatedTo(ChronoUnit.MINUTES);

        Customer customer = customerRepo.findByCustomerEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + customerEmail));
        RestaurantTable table = tableRepo.findById(tableId)
                .orElseThrow(() -> new IllegalArgumentException("Table not found: " + tableId));

        // Overlap check: any reservation within +/- 1 hour for same table
        LocalDateTime start = time.minusHours(1);
        LocalDateTime end = time.plusHours(1);
        List<Reservation> overlaps = reservationRepo.findByTable_TableIdAndReservationTimeBetween(tableId, start, end);
        boolean conflict = overlaps.stream().anyMatch(r -> r.getStatus() != ReservationStatus.CANCELLED);
        if (conflict) {
            throw new IllegalStateException("Table already reserved near the requested time");
        }

        Reservation r = Reservation.builder()
                .customer(customer)
                .table(table)
                .reservationTime(time)
                .numberOfGuests(guests)
                .specialRequest(specialRequest)
                .status(ReservationStatus.PENDING)
                .build();
        return reservationRepo.save(r);
    }

    @Override
    public List<Reservation> myReservations(String customerEmail) {
        return reservationRepo.findByCustomer_CustomerEmail(customerEmail);
    }

    @Override
    public List<Reservation> allReservations() {
        return reservationRepo.findAll();
    }

    @Override
    public Reservation updateStatus(String reservationId, ReservationStatus status) {
        Reservation r = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found: " + reservationId));
        r.setStatus(status);
        return reservationRepo.save(r);
    }

    @Override
    public void deleteById(String reservationId) {
        reservationRepo.deleteById(reservationId);
    }
}
