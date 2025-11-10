package com.feastflow.model;

import com.feastflow.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder.Default;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reservations")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Reservation {
    @Id
    private String reservationId;

    @DBRef
    private Customer customer;

    @DBRef
    private RestaurantTable table;

    private LocalDateTime reservationTime;
    private Integer numberOfGuests;
    private String specialRequest;

    @Default
    private ReservationStatus status = ReservationStatus.PENDING;
}
