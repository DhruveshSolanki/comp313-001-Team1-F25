package com.feastflow.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.feastflow.enums.ReservationStatus;
import com.feastflow.model.Customer;
import com.feastflow.model.Reservation;
import com.feastflow.model.RestaurantTable;
import com.feastflow.repository.ICustomerRepository;
import com.feastflow.repository.IReservationRepository;
import com.feastflow.repository.IRestaurantTableRepository;
import com.feastflow.service.impl.ReservationService;

public class ReservationServiceTests {

    private IReservationRepository reservationRepo;
    private ICustomerRepository customerRepo;
    private IRestaurantTableRepository tableRepo;
    private ReservationService reservationService;

    @BeforeEach
    void setUp() {
        reservationRepo = mock(IReservationRepository.class);
        customerRepo = mock(ICustomerRepository.class);
        tableRepo = mock(IRestaurantTableRepository.class);
        reservationService = new ReservationService(reservationRepo, customerRepo, tableRepo);
    }

    @Test
    void createThrowsOnOverlap() {
        LocalDateTime time = LocalDateTime.now().plusHours(2);
        Customer cust = Customer.builder().customerEmail("cust@example.com").build();
        RestaurantTable table = RestaurantTable.builder().tableId("t1").build();

        when(customerRepo.findByCustomerEmail("cust@example.com")).thenReturn(Optional.of(cust));
        when(tableRepo.findById("t1")).thenReturn(Optional.of(table));
        Reservation existing = Reservation.builder().status(ReservationStatus.CONFIRMED).build();
        when(reservationRepo.findByTable_TableIdAndReservationTimeBetween(anyString(), any(), any())).thenReturn(List.of(existing));

        assertThrows(IllegalStateException.class, () ->
                reservationService.create("cust@example.com", "t1", time, 2, null));
    }

    @Test
    void createSucceedsWhenNoOverlap() {
        LocalDateTime time = LocalDateTime.now().plusHours(2);
        Customer cust = Customer.builder().customerEmail("cust@example.com").build();
        RestaurantTable table = RestaurantTable.builder().tableId("t1").build();

        when(customerRepo.findByCustomerEmail("cust@example.com")).thenReturn(Optional.of(cust));
        when(tableRepo.findById("t1")).thenReturn(Optional.of(table));
        when(reservationRepo.findByTable_TableIdAndReservationTimeBetween(anyString(), any(), any())).thenReturn(List.of());
        when(reservationRepo.save(any(Reservation.class))).thenAnswer(inv -> inv.getArgument(0));

        Reservation r = reservationService.create("cust@example.com", "t1", time, 4, "Window");
        assertNotNull(r);
        assertEquals(ReservationStatus.PENDING, r.getStatus());
        assertEquals(4, r.getNumberOfGuests());
    }
}
