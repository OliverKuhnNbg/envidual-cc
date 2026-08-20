package com.envidual.tweets_app.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/*
 * ADR: Bounded CORS Configuration for Local Development
 * Context: The Angular frontend (localhost:4200) and Spring Boot backend (localhost:8080) operate on different origins during local development, triggering browser Same-Origin Policy restrictions.
 * Decision: Implement a global WebMvcConfigurer to explicitly allow CORS traffic exclusively from expected local development origins.
 * Consequence: Enables seamless local development bridging. In a production deployment, this configuration should either be strictly tied to environment variables or completely removed in favor of infrastructure-level routing (e.g., NGINX, AWS API Gateway) to enforce stricter security perimeters.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200", "http://127.0.0.1:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}