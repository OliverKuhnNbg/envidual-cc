package com.envidual.tweets_app.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TweetCreateRequest(
        @NotBlank(message = "Autor ist erforderlich")
        @Size(max = 100, message = "Autor darf maximal 100 Zeichen lang sein")
        String autor,

        @NotBlank(message = "Message ist erforderlich")
        @Size(max = 280, message = "Message darf maximal 280 Zeichen lang sein")
        String message
) {}
