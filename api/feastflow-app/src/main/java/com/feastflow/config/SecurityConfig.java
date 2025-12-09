package com.feastflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.feastflow.security.JwtAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${frontend.origin:}")
    private String frontendOrigin;

    @Value("${frontend.origin.extra:}")
    private String extraFrontendOrigin;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) 
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/v1/auth/**", "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
                    .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Use strong hashing for all new passwords
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS configuration:
     * - Allows local development from Angular dev server (http://localhost:4200)
     * - Allows future hosted frontend origin (configure via environment property FRONTEND_ORIGIN)
     * - Methods/headers commonly used by REST + Authorization
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Collect origins: dev localhost, application properties, and optional env var FRONTEND_ORIGIN
        java.util.List<String> origins = new java.util.ArrayList<>();

        if (frontendOrigin != null && !frontendOrigin.isBlank()) origins.add(frontendOrigin);
        if (extraFrontendOrigin != null && !extraFrontendOrigin.isBlank()) origins.add(extraFrontendOrigin);
        
        // Deduplicate and set
        java.util.Set<String> unique = new java.util.LinkedHashSet<>(origins);
        config.setAllowedOrigins(new java.util.ArrayList<>(unique));

        config.setAllowedMethods(java.util.List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        config.setAllowedHeaders(java.util.List.of("Authorization","Content-Type","Accept","Origin"));
        config.setExposedHeaders(java.util.List.of("Authorization"));
        config.setAllowCredentials(true);

        // Wildcard pattern support — uncomment if hosting on Vercel/Netlify
        // config.addAllowedOriginPattern("https://*.vercel.app");
        // Allow Firebase Hosting subdomains (web.app and firebaseapp.com)
        config.addAllowedOriginPattern("https://*.web.app");
        config.addAllowedOriginPattern("https://*.firebaseapp.com");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
