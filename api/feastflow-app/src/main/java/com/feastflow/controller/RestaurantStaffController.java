package com.feastflow.controller;

import com.feastflow.enums.RestaurantStaffStatus;
import com.feastflow.model.RestaurantStaff;
import com.feastflow.repository.RestaurantStaffRepository;
import com.feastflow.dto.RestaurantStaffRequest;
import com.feastflow.dto.RestaurantStaffResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/staff")
@Tag(name = "Restaurant Staff", description = "APIs for managing restaurant staff (Manager only)")
public class RestaurantStaffController {

    private final RestaurantStaffRepository repository;

    public RestaurantStaffController(RestaurantStaffRepository repository) {
        this.repository = repository;
    }

    // List all staff
    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "List all staff", description = "Returns all restaurant staff records. Manager access required.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List returned successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<?> listAll() {
        java.util.List<RestaurantStaffResponse> resp = repository.findAll().stream()
                .map(RestaurantStaffController::toResponse)
                .toList();
        return ResponseEntity.ok(resp);
    }

    // Create staff
    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Create staff", description = "Creates a new restaurant staff. Manager access required.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Staff created"),
        @ApiResponse(responseCode = "400", description = "Validation error"),
        @ApiResponse(responseCode = "409", description = "Email already in use"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<?> create(@Valid @RequestBody RestaurantStaffRequest request) {
        // Default ACTIVE if not provided
        if (request.getStatus() == null) {
            request.setStatus(RestaurantStaffStatus.ACTIVE);
        }
        // Email uniqueness check
        if (request.getStaffEmail() != null && repository.existsByStaffEmail(request.getStaffEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error("email_taken", "Email already in use"));
        }
        RestaurantStaff staff = RestaurantStaff.builder()
                .staffName(request.getStaffName())
                .staffEmail(request.getStaffEmail())
                .staffPassword(request.getStaffPassword())
                .staffPhoneNumber(request.getStaffPhoneNumber())
                .role(request.getRole())
                .status(request.getStatus())
                .build();
        RestaurantStaff saved = repository.save(staff);
        return ResponseEntity.created(URI.create("/api/v1/staff/" + saved.getStaffId())).body(toResponse(saved));
    }

    // Update staff (basic fields)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Update staff", description = "Updates an existing restaurant staff by id. Manager access required.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Staff updated"),
        @ApiResponse(responseCode = "400", description = "Validation error"),
        @ApiResponse(responseCode = "404", description = "Staff not found"),
        @ApiResponse(responseCode = "409", description = "Email already in use"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<?> update(@Parameter(description = "Staff id") @PathVariable("id") String id, @Valid @RequestBody RestaurantStaffRequest input) {
        Optional<RestaurantStaff> existingOpt = repository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error("not_found", "Staff not found"));
        }
        RestaurantStaff existing = existingOpt.get();
        if (input.getStaffName() != null) existing.setStaffName(input.getStaffName());
        if (input.getStaffEmail() != null) {
            // If changing email, ensure new email is unique
            String newEmail = input.getStaffEmail();
            if (!newEmail.equals(existing.getStaffEmail()) && repository.existsByStaffEmail(newEmail)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error("email_taken", "Email already in use"));
            }
            existing.setStaffEmail(newEmail);
        }
        if (input.getStaffPassword() != null) existing.setStaffPassword(input.getStaffPassword());
        if (input.getStaffPhoneNumber() != null) existing.setStaffPhoneNumber(input.getStaffPhoneNumber());
        if (input.getRole() != null) existing.setRole(input.getRole());
        if (input.getStatus() != null) existing.setStatus(input.getStatus());
        RestaurantStaff saved = repository.save(existing);
        return ResponseEntity.ok(toResponse(saved));
    }

    // Delete staff
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Delete staff", description = "Deletes a restaurant staff by id. Manager access required.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Staff deleted"),
        @ApiResponse(responseCode = "404", description = "Staff not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<?> delete(@Parameter(description = "Staff id") @PathVariable("id") String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error("not_found", "Staff not found"));
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Change status explicitly
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Change staff status", description = "Changes staff status (ACTIVE/INACTIVE). Manager access required.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Status updated"),
        @ApiResponse(responseCode = "404", description = "Staff not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<?> changeStatus(@Parameter(description = "Staff id") @PathVariable("id") String id,
                                                        @Parameter(description = "New status") @RequestParam("status") RestaurantStaffStatus status) {
        Optional<RestaurantStaff> existingOpt = repository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error("not_found", "Staff not found"));
        }
        RestaurantStaff existing = existingOpt.get();
        existing.setStatus(status);
        RestaurantStaff saved = repository.save(existing);
        return ResponseEntity.ok(toResponse(saved));
    }

    private static java.util.Map<String, Object> error(String code, String message) {
        java.util.Map<String, Object> m = new java.util.HashMap<>();
        m.put("error", code);
        m.put("message", message);
        return m;
    }

    private static RestaurantStaffResponse toResponse(RestaurantStaff s) {
        return RestaurantStaffResponse.builder()
                .staffId(s.getStaffId())
                .staffName(s.getStaffName())
                .staffEmail(s.getStaffEmail())
                .staffPhoneNumber(s.getStaffPhoneNumber())
                .role(s.getRole())
                .status(s.getStatus())
                .build();
    }
}
