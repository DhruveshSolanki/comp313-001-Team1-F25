package com.feastflow.security;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtTokenProvider.validateToken(token)) {
                // Block refresh tokens from being used as access tokens in Authorization header
                try {
                    if (jwtTokenProvider.isRefreshToken(token)) {
                        if (log.isDebugEnabled()) {
                            log.debug("Refresh token supplied in Authorization header; ignoring for request auth");
                        }
                        filterChain.doFilter(request, response);
                        return;
                    }
                } catch (Exception ignored) {}
                String subject = jwtTokenProvider.getSubject(token);
                String role = jwtTokenProvider.getRole(token);
                if (log.isDebugEnabled()) {
                    log.debug("JWT accepted: subject={}, roleClaim={}", subject, role);
                }
        // Spring Security expects role names without the ROLE_ prefix when using .roles()
        // Ensure claim is uppercase and non-null; default to USER
        String normalizedRole = (role != null && !role.isBlank()) ? role.trim().toUpperCase() : "USER";
        UserDetails principal = User.withUsername(subject)
            .password("") // password not needed here
            .roles(normalizedRole)
            .build();
                if (log.isDebugEnabled()) {
                    log.debug("Authorities for subject {} => {}", subject, principal.getAuthorities());
                }
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null,
                        principal.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                if (log.isDebugEnabled()) {
                    log.debug("JWT rejected: validation failed");
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
