package com.feastflow.controller;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.authentication.AuthenticationManager;

import com.feastflow.enums.RestaurantStaffRole;
import com.feastflow.model.Customer;
import com.feastflow.model.RestaurantStaff;
import com.feastflow.model.auth.LoginRequest;
import com.feastflow.model.auth.LoginResponse;
import com.feastflow.repository.ICustomerRepository;
import com.feastflow.repository.IRestaurantStaffRepository;
import com.feastflow.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AuthControllerTests {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private ICustomerRepository customerRepository;

    @Mock
    private IRestaurantStaffRepository staffRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController controller;

    @BeforeEach
    void setUp() {
        authenticationManager = mock(AuthenticationManager.class);
        jwtTokenProvider = mock(JwtTokenProvider.class);
        customerRepository = mock(ICustomerRepository.class);
        staffRepository = mock(IRestaurantStaffRepository.class);
        controller = new AuthController(authenticationManager, jwtTokenProvider, customerRepository, staffRepository, passwordEncoder);
    }

    @Test
    void loginAsStaffReturnsTokenWithRole() {
        LoginRequest req = new LoginRequest();
        req.setEmail("chef@example.com");
        req.setPassword("pw");

        when(staffRepository.findByStaffEmail("chef@example.com")).thenReturn(Optional.of(
                RestaurantStaff.builder().staffEmail("chef@example.com").staffPassword("pw").role(RestaurantStaffRole.CHEF).build()
        ));
        when(jwtTokenProvider.generateToken("chef@example.com", RestaurantStaffRole.CHEF)).thenReturn("token123");

    LoginResponse res = controller.login(req).getBody();
        assertNotNull(res);
        assertEquals("token123", res.getToken());
        assertEquals("CHEF", res.getRole());
    // refresh token fields may be null in this unit since provider is mocked; not asserting them
    }

    @Test
    void loginAsCustomerReturnsTokenWithRoleCustomer() {
        LoginRequest req = new LoginRequest();
        req.setEmail("cust@example.com");
        req.setPassword("pw");

        when(staffRepository.findByStaffEmail("cust@example.com")).thenReturn(Optional.empty());
        when(customerRepository.findByCustomerEmail("cust@example.com")).thenReturn(Optional.of(
                Customer.builder().customerEmail("cust@example.com").customerPassword("pw").build()
        ));
        when(jwtTokenProvider.generateCustomerToken("cust@example.com")).thenReturn("ctoken");

    LoginResponse res = controller.login(req).getBody();
        assertNotNull(res);
        assertEquals("ctoken", res.getToken());
        assertEquals("CUSTOMER", res.getRole());
    }
}
