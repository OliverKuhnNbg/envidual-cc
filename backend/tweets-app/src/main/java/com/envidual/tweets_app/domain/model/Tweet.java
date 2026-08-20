package com.envidual.tweets_app.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/*
 * ADR: Pragmatic Domain-Driven Design (Domain Entity == JPA Entity)
 * Context: Pure Clean Architecture dictates absolute separation between domain logic and framework infrastructure. 
 * Decision: We are applying JPA @Entity annotations directly to the Core Domain model to reduce mapping overhead.
 * Consequence: We accept a tight coupling to the JPA specification within our core domain. To mitigate risks to system stability and prevent an Anemic Domain Model, we strictly encapsulate state mutations. The default constructor required by Hibernate is protected, setters are omitted, and invariants are enforced within the factory method.
 */
@Entity
@Table(name = "tweets")
public class Tweet {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "author", nullable = false, length = 100)
    private String author;

    @Column(name = "content", nullable = false, length = 280)
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Tweet() {
        // JPA requirement
    }

    private Tweet(UUID id, String author, String content, Instant createdAt) {
        this.id = id;
        this.author = author;
        this.content = content;
        this.createdAt = createdAt;
    }

    public static Tweet create(String author, String content) {
        validateInput(author, content);
        return new Tweet(UUID.randomUUID(), author, content, Instant.now());
    }

    private static void validateInput(String author, String content) {
        if (author == null || author.trim().isEmpty()) {
            throw new IllegalArgumentException("Author cannot be null or empty.");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Tweet content cannot be empty.");
        }
        if (content.length() > 280) {
            throw new IllegalArgumentException("Tweet content must not exceed 280 characters.");
        }
    }

    public UUID getId() {
        return id;
    }

    public String getAuthor() {
        return author;
    }

    public String getContent() {
        return content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
