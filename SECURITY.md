# FeastFlow API Security

## Overview
This document describes the JWT-based authentication mechanism and Swagger (OpenAPI) bearer token integration added to the FeastFlow backend.

## Authentication Flow
1. Client submits POST `/api/v1/auth/login` with JSON body:
   ```json
   { "email": "user@example.com", "password": "plaintextPassword" }
   ```
2. Server authenticates credentials against MongoDB records for `RestaurantStaff` or `Customer`.
3. Access & refresh tokens are returned:
  ```json
  {
    "token": "<ACCESS_JWT>",
    "expiresIn": 3600000,
    "role": "CHEF",
    "refreshToken": "<REFRESH_JWT>",
    "refreshExpiresIn": 604800000
  }
  ```
4. Client includes the token in subsequent requests:
   ```http
   Authorization: Bearer <JWT>
   ```
5. Protected endpoints (all except `/api/v1/auth/**` and Swagger docs) require a valid access token.
6. To renew an access token, POST the refresh token to `/api/v1/auth/refresh` (raw body containing the token). The original refresh token remains valid until its own expiration.

## Token Details
- Algorithm: HS256
- Claims:
  - `sub` (subject): user email
  - `role`: one of `MANAGER`, `CHEF`, `SERVER`, `ADMIN`, or `CUSTOMER`
  - `token_type`: `refresh` for refresh tokens (absent for access tokens)
  - `iat` issued at
  - `exp` expiration
- Expiration default: 1 hour (`security.jwt.expirationMillis`)
- Secret: Base64-encoded string (`security.jwt.secret`). Override via environment variable `SECURITY_JWT_SECRET`.
 - Refresh token expiration default: 7 days (`security.jwt.refreshExpirationMillis`).

## Environment Configuration
```properties
security.jwt.secret=${SECURITY_JWT_SECRET:ZmVhc3RmbG93LWRlZmF1bHQtand0LXNlY3JldC1rZXk=}
security.jwt.expirationMillis=${SECURITY_JWT_EXPIRATION:3600000}
```
Generate a new secret:
```bash
openssl rand -base64 32
```
Set it (macOS example):
```bash
export SECURITY_JWT_SECRET="<generated>"
```

## Swagger Usage
1. Navigate to `/swagger-ui.html` or `/swagger-ui/index.html`.
2. Click "Authorize" button.
3. Enter: `Bearer <ACCESS_JWT>` (the UI may auto-prefix if you just paste the token).
4. Secured endpoints will now include the `Authorization` header when executed from Swagger UI.

## Files Added
- `SecurityConfig` – Configures stateless JWT security.
- `JwtTokenProvider` – Creates and validates tokens (JJWT 0.12 API).
- `JwtAuthenticationFilter` – Extracts and authenticates bearer tokens per request.
- `CustomUserDetailsService` – Loads users from MongoDB.
- `AuthController` – Login endpoint.
- `OpenApiConfig` – Adds OpenAPI bearer security scheme.
- DTOs: `LoginRequest`, `LoginResponse`.

## Future Improvements
- Password hashing with `BCryptPasswordEncoder` (now enabled):
  - A `PasswordMigrationRunner` can hash existing plaintext passwords at startup when `security.password.migrate=true`.
  - After migration completes, remove or set `security.password.migrate` to `false` to avoid re-processing.
  - All new logins use BCrypt hashing.
- Add refresh token endpoint / rotation strategy.
- Add role-based method or endpoint security annotations (`@PreAuthorize`).
- Centralize `expiresIn` by exposing configuration from `JwtTokenProvider`.
- Add logout / token revocation list if needed.

## Testing Instructions
After building (`./mvnw clean package`), run the app and execute:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"staff@example.com","password":"password"}'
```
Use the returned token:
```bash
curl http://localhost:8080/api/v1/restaurantmenu \
  -H "Authorization: Bearer <JWT>"
```

## Security Notes
- Keep the JWT secret out of source control (use environment variables in production).
- Consider using shorter expirations plus refresh tokens for higher security.
- Monitor dependency versions (Spring Boot, JJWT) for CVE patches.
 - If you previously stored plaintext passwords, run once with:
   ```properties
   security.password.migrate=true
   ```
   Then turn it off.
