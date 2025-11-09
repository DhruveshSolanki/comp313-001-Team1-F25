package com.feastflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.feastflow.enums.ReservationStatus;
import com.feastflow.model.Reservation;
import com.feastflow.security.SecurityUtils;
import com.feastflow.service.IReservationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Tag(name = "Reservation API")
@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    private final IReservationService reservationService;

    public ReservationController(IReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Create a reservation (customer)")
    public ResponseEntity<Reservation> create(@RequestBody Map<String, Object> body) {
        String email = SecurityUtils.getCurrentUserEmail();
        String tableId = (String) body.get("tableId");
        String timeStr = (String) body.get("reservationTime"); // ISO-8601
        Integer guests = body.get("numberOfGuests") != null ? ((Number) body.get("numberOfGuests")).intValue() : 2;
        String special = (String) body.get("specialRequest");
        LocalDateTime time = LocalDateTime.parse(timeStr);
        return ResponseEntity.ok(reservationService.create(email, tableId, time, guests, special));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "List my reservations")
    public ResponseEntity<List<Reservation>> myReservations() {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(reservationService.myReservations(email));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','SERVER')")
    @Operation(summary = "List all reservations (staff)")
    public ResponseEntity<List<Reservation>> allReservations() {
        return ResponseEntity.ok(reservationService.allReservations());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','SERVER')")
    @Operation(summary = "Update reservation status (staff)")
    public ResponseEntity<Reservation> updateStatus(@PathVariable("id") String reservationId,
                                                    @RequestBody Map<String, String> body) {
        ReservationStatus status = ReservationStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(reservationService.updateStatus(reservationId, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Delete a reservation (staff)")
    public ResponseEntity<Void> delete(@PathVariable("id") String reservationId) {
        reservationService.deleteById(reservationId);
        return ResponseEntity.noContent().build();
    }
}
