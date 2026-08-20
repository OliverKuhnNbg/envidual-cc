package com.envidual.tweets_app.application.service;

import com.envidual.tweets_app.domain.model.Tweet;
import com.envidual.tweets_app.domain.repository.TweetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TweetService {

    private final TweetRepository tweetRepository;

    public TweetService(TweetRepository tweetRepository) {
        this.tweetRepository = tweetRepository;
    }

    /*
     * ADR: Centralized Search Logic in Application Service
     * Context: The API needs to handle both retrieving all tweets and filtering them by a keyword.
     * Decision: Handle the conditional routing to the appropriate repository method within the Application Service rather than the Web Controller.
     * Consequence: Keeps the Web Adapter thin and ensures that any future protocol (like gRPC) accessing this use case uses the exact same search logic.
     */
    @Transactional(readOnly = true)
    public List<Tweet> searchTimeline(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return tweetRepository.findAllByOrderByCreatedAtDesc();
        }
        return tweetRepository.findByContentContainingIgnoreCaseOrderByCreatedAtDesc(keyword);
    }

    @Transactional
    public Tweet publishTweet(String author, String content) {
        Tweet newTweet = Tweet.create(author, content);
        return tweetRepository.save(newTweet);
    }
}