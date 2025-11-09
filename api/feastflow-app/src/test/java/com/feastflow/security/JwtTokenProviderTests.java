package com.feastflow.security;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.feastflow.enums.RestaurantStaffRole;

public class JwtTokenProviderTests {

    private JwtTokenProvider provider;

    @BeforeEach
    void setUp() {
        provider = new JwtTokenProvider();
        // Inject test secret & expiration (1s) via reflection since fields are private
        ReflectionTestUtils.setField(provider, "jwtSecretBase64", "dGVzdHNlY3JldGtleXRlc3RzZWNyZXRrZXk="); // base64 of testsecretkeytestsecretkey
        ReflectionTestUtils.setField(provider, "jwtExpirationMillis", 2000L); // 2 seconds
    }

    @Test
    void generateAndValidateStaffToken() {
        String token = provider.generateToken("chef@example.com", RestaurantStaffRole.CHEF);
        assertNotNull(token);
        assertTrue(provider.validateToken(token));
        assertEquals("chef@example.com", provider.getSubject(token));
        assertEquals("CHEF", provider.getRole(token));
    }

    @Test
    void generateAndValidateCustomerToken() {
        String token = provider.generateCustomerToken("cust@example.com");
        assertNotNull(token);
        assertTrue(provider.validateToken(token));
        assertEquals("cust@example.com", provider.getSubject(token));
        assertEquals("CUSTOMER", provider.getRole(token));
    }

    @Test
    void invalidTokenFailsValidation() {
        assertFalse(provider.validateToken("not.a.real.token"));
    }

    @Test
    void refreshTokenGeneratesAndIsDetected() {
        String refresh = provider.generateRefreshToken("chef@example.com");
        assertNotNull(refresh);
        assertTrue(provider.validateToken(refresh));
        assertTrue(provider.isRefreshToken(refresh));
    }
}
