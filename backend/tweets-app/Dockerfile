# ADR: Multi-Stage Container Build
# Context: We need a reproducible build artifact independent of local host SDK configurations or IDE indexing issues.
# Decision: Implement a multi-stage Dockerfile utilizing the official JDK image for compiling/building via Gradle, and a minimal JRE image for execution.
# Consequence: Ensures the final container footprint is minimal and secure (excluding build tools). It guarantees environment parity across local development, CI/CD pipelines, and production deployments.
FROM eclipse-temurin:25-jdk-alpine AS builder
WORKDIR /app

COPY gradle/ gradle/
COPY gradlew build.gradle.kts settings.gradle.kts ./
COPY src/ src/

RUN chmod +x gradlew
RUN ./gradlew build -x test

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]