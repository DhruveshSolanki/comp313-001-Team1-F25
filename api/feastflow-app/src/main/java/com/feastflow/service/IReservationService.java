package com.feastflow.service;

import java.time.LocalDateTime;
import java.util.List;

import com.feastflow.enums.ReservationStatus;
import com.feastflow.model.Reservation;

public interface IReservationService {
    Reservation create(String customerEmail, String tableId, LocalDateTime time, int guests, String specialRequest);
    List<Reservation> myReservations(String customerEmail);
    List<Reservation> allReservations();
    Reservation updateStatus(String reservationId, ReservationStatus status);
    void deleteById(String reservationId);
}
