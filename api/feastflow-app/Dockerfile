## Multi-stage Dockerfile for Spring Boot (Maven) on Cloud Run

### BUILD STAGE
FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace

# Copy Maven wrapper + pom first
COPY mvnw* pom.xml ./
COPY .mvn .mvn

# Download dependencies
RUN chmod +x mvnw && ./mvnw -q dependency:go-offline

# Copy source
COPY src src

# Build JAR (skip tests for speed)
RUN ./mvnw -q -B package -DskipTests


### RUNTIME STAGE
FROM eclipse-temurin:17-jre-jammy AS run
WORKDIR /app

# Add non-root user
RUN useradd -r -u 1001 spring

# Copy built jar
COPY --from=build /workspace/target/*.jar app.jar

# Cloud Run dynamic port
ENV PORT=8081

# JVM optimizations
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:MinRAMPercentage=50.0"

USER spring

# Run Spring Boot with dynamic Cloud Run port
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
