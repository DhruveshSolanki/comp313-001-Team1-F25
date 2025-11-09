package com.feastflow.security;

import javax.crypto.SecretKey;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.feastflow.enums.RestaurantStaffRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    @Value("${security.jwt.secret:ZmVhc3RmbG93LWRlZmF1bHQtand0LXNlY3JldC1rZXk=}")
    private String jwtSecretBase64; // default Base64 value if not overridden

    @Value("${security.jwt.expirationMillis:3600000}")
    private long jwtExpirationMillis; // default 1 hour (access)

    @Value("${security.jwt.refreshExpirationMillis:604800000}")
    private long jwtRefreshExpirationMillis; // default 7 days (refresh)

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecretBase64);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String subject, RestaurantStaffRole role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMillis);

        return Jwts.builder()
                .subject(subject)
                .claim("role", role != null ? role.name() : null)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String generateCustomerToken(String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMillis);
        return Jwts.builder()
                .subject(subject)
                .claim("role", "CUSTOMER")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtRefreshExpirationMillis);
        return Jwts.builder()
                .subject(subject)
                .claim("token_type", "refresh")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public String getSubject(String token) {
        Claims claims = Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }

    public String getRole(String token) {
        Claims claims = Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
        Object role = claims.get("role");
        return role != null ? role.toString() : null;
    }

    public boolean isRefreshToken(String token) {
        Claims claims = Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
        Object type = claims.get("token_type");
        return type != null && "refresh".equals(type.toString());
    }

    public long getAccessExpirationMillis() { return jwtExpirationMillis; }
    public long getRefreshExpirationMillis() { return jwtRefreshExpirationMillis; }
}
