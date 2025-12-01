## Multi-stage Dockerfile for Spring Boot (Maven) deployment to Google Cloud Run
## Build stage
FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace

# Copy Maven wrapper and pom first for layer caching
COPY mvnw* pom.xml ./
COPY .mvn .mvn

# Download dependencies (will cache)
RUN ./mvnw -q dependency:go-offline

# Copy source
COPY src src

# Build application (skip tests for speed; adjust if you have tests)
RUN ./mvnw -q package -DskipTests

## Runtime stage (slim JRE)
FROM eclipse-temurin:17-jre-jammy AS run
WORKDIR /app

# Add non-root user
RUN useradd -r -u 1001 spring

# Copy built jar
COPY --from=build /workspace/target/feastflow-app-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Cloud Run injects $PORT env; we rely on server.port config)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:MinRAMPercentage=50.0"

# Healthcheck (optional): expecting actuator if later added
# HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/actuator/health || exit 1

USER spring

# Run the app; Cloud Run sets PORT so Spring picks it up via server.port=${PORT:8080}
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
