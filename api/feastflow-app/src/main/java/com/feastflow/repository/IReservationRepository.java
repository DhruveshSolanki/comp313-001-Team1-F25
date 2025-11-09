package com.feastflow.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.feastflow.model.Reservation;

@Repository
public interface IReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByTable_TableIdAndReservationTimeBetween(String tableId, LocalDateTime start, LocalDateTime end);
    List<Reservation> findByCustomer_CustomerEmail(String customerEmail);
}
