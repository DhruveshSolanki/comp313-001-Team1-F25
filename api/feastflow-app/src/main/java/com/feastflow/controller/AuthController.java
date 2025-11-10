package com.feastflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.feastflow.enums.RestaurantStaffRole;
import com.feastflow.model.Customer;
import com.feastflow.model.RestaurantStaff;
import com.feastflow.model.auth.LoginRequest;
import com.feastflow.model.auth.LoginResponse;
import com.feastflow.model.auth.RegisterRequest;
import com.feastflow.repository.ICustomerRepository;
import com.feastflow.repository.IRestaurantStaffRepository;
import com.feastflow.security.JwtTokenProvider;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Optional;

@Tag(name = "Authentication API")
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final ICustomerRepository customerRepository;
    private final IRestaurantStaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          ICustomerRepository customerRepository,
                          IRestaurantStaffRepository staffRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.customerRepository = customerRepository;
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email & password to receive JWT token")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // determine role and generate token
        String email = request.getEmail();
        Optional<RestaurantStaff> staffOpt = staffRepository.findByStaffEmail(email);
        String token;
        String role;
        if (staffOpt.isPresent()) {
            RestaurantStaffRole staffRole = staffOpt.get().getRole();
            token = jwtTokenProvider.generateToken(email, staffRole);
            role = staffRole != null ? staffRole.name() : "USER";
        } else {
            Optional<Customer> customerOpt = customerRepository.findByCustomerEmail(email);
            if (customerOpt.isEmpty()) {
                // Shouldn't happen because authentication succeeded, but fallback
                role = "USER";
                token = jwtTokenProvider.generateCustomerToken(email);
            } else {
                role = "CUSTOMER";
                token = jwtTokenProvider.generateCustomerToken(email);
            }
        }

        String refreshToken = jwtTokenProvider.generateRefreshToken(email);
        long expiresIn = jwtTokenProvider.getAccessExpirationMillis();
        long refreshExpiresIn = jwtTokenProvider.getRefreshExpirationMillis();
        return ResponseEntity.ok(new LoginResponse(token, expiresIn, role, refreshToken, refreshExpiresIn));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Exchange a valid refresh token for a new access token")
    public ResponseEntity<LoginResponse> refresh(@RequestBody String refreshToken) {
        // Expect raw token or JSON string; simplest: raw text body
        String token = refreshToken.trim();
        if (!jwtTokenProvider.validateToken(token) || !jwtTokenProvider.isRefreshToken(token)) {
            return ResponseEntity.status(401).build();
        }
        String subject = jwtTokenProvider.getSubject(token);
        Optional<RestaurantStaff> staffOpt = staffRepository.findByStaffEmail(subject);
        String role;
        String newAccessToken;
        if (staffOpt.isPresent()) {
            RestaurantStaffRole staffRole = staffOpt.get().getRole();
            newAccessToken = jwtTokenProvider.generateToken(subject, staffRole);
            role = staffRole != null ? staffRole.name() : "USER";
        } else if (customerRepository.findByCustomerEmail(subject).isPresent()) {
            role = "CUSTOMER";
            newAccessToken = jwtTokenProvider.generateCustomerToken(subject);
        } else {
            return ResponseEntity.status(401).build();
        }
        long expiresIn = jwtTokenProvider.getAccessExpirationMillis();
        long refreshExpiresIn = jwtTokenProvider.getRefreshExpirationMillis();
        return ResponseEntity.ok(new LoginResponse(newAccessToken, expiresIn, role, token, refreshExpiresIn));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new customer; then login to obtain tokens")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
        String email = request.getEmail();
        // Check if email already exists among staff or customers
        if (staffRepository.findByStaffEmail(email).isPresent() ||
            customerRepository.findByCustomerEmail(email).isPresent()) {
            return ResponseEntity.status(409).build();
        }

        // Create and save new customer with hashed password
    com.feastflow.model.Customer customer = com.feastflow.model.Customer.builder()
                .customerName(request.getName())
                .customerEmail(email)
                .customerPassword(passwordEncoder.encode(request.getPassword()))
                .customerPhoneNumber(request.getPhoneNumber())
                .build();
        customerRepository.save(customer);

        
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout the current user (stateless) — client should delete stored tokens",
               description = "Since JWT is stateless in this app, the server does not keep session state. This endpoint exists for symmetry and future revocation support. Clients should clear access/refresh tokens locally. If a refresh token is provided in the request body (plain text), it may be validated but is not persisted for revocation in this version.")
    public ResponseEntity<Void> logout(@RequestBody(required = false) String refreshToken) {
        // Optionally validate the provided refresh token to ensure it is structurally correct
        if (refreshToken != null && !refreshToken.isBlank()) {
            // Best-effort validation; ignore result as we don't persist blacklist in this version
            try { jwtTokenProvider.validateToken(refreshToken.trim()); } catch (Exception ignored) {}
        }
        return ResponseEntity.noContent().build();
    }
}
