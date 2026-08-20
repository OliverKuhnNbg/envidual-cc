package com.envidual.tweets_app.infrastructure.web.dto;

import com.envidual.tweets_app.domain.model.Tweet;

import java.time.Instant;
import java.util.UUID;

/*
 * ADR: Web API Contract Isolation
 * Context: The external API specification requires the payload keys "id", "message", and "autor", which differ from the internal domain terminology (content, author).
 * Decision: Utilize immutable Java Records as DTOs to map internal state to the exact external contract.
 * Consequence: Decouples the API contract from database schemas and domain models, ensuring internal refactorings do not break client applications. 
 */
public record TweetResponse(
        UUID id,
        String autor,
        String message,
        Instant dateString
) {
    public static TweetResponse fromDomain(Tweet tweet) {
        return new TweetResponse(
                tweet.getId(),
                tweet.getAuthor(),
                tweet.getContent(),
                tweet.getCreatedAt()
        );
    }
}