package com.envidual.tweets_app.infrastructure.web.controller;

import com.envidual.tweets_app.application.service.TweetService;
import com.envidual.tweets_app.infrastructure.web.dto.TweetCreateRequest;
import com.envidual.tweets_app.infrastructure.web.dto.TweetResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tweets")
public class TweetController {

    private final TweetService tweetService;

    public TweetController(TweetService tweetService) {
        this.tweetService = tweetService;
    }

    @GetMapping
    public ResponseEntity<List<TweetResponse>> getTweets(
            @RequestParam(value = "search", required = false) String searchKeyword) {
        
        List<TweetResponse> responses = tweetService.searchTimeline(searchKeyword).stream()
                .map(TweetResponse::fromDomain)
                .toList();
                
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<TweetResponse> createTweet(@Valid @RequestBody TweetCreateRequest request) {
        var savedTweet = tweetService.publishTweet(request.autor(), request.message());
        return ResponseEntity.status(HttpStatus.CREATED).body(TweetResponse.fromDomain(savedTweet));
    }
}