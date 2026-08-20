package com.envidual.tweets_app.infrastructure.bootstrap;

import com.envidual.tweets_app.domain.model.Tweet;
import com.envidual.tweets_app.domain.repository.TweetRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/*
 * ADR: Ephemeral Test Infrastructure via Testcontainers
 * Context: Tests failing with "Failed to determine a suitable driver class" occur because the application context lacks database coordinates when docker-compose auto-configuration is bypassed during test execution.
 * Decision: Integrate Testcontainers directly into the test class utilizing Spring Boot's @ServiceConnection.
 * Consequence: Maximizes system stability for automated pipelines. The test suite dynamically provisions a disposable PostgreSQL container. @ServiceConnection intercepts the ephemeral JDBC URL and credentials, seamlessly injecting them into the ApplicationContext without requiring manual application.yml property overrides.
 */
@SpringBootTest
@Testcontainers
class DatabaseSeedingIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private TweetRepository tweetRepository;

    @Test
    void shouldHaveSeededExactly5000TweetsWithEvenDistribution() {
        List<Tweet> allTweets = tweetRepository.findAll();
        
        assertThat(allTweets).hasSize(5000);
        
        long seedUserCount = allTweets.stream()
                .filter(t -> "SeedUser".equals(t.getAuthor()))
                .count();
        long oliverUserCount = allTweets.stream()
                .filter(t -> "OliverUser".equals(t.getAuthor()))
                .count();
        
        assertThat(seedUserCount).isEqualTo(2500L);
        assertThat(oliverUserCount).isEqualTo(2500L);
    }

    @Test
    void shouldFormatSeedMessageCorrectlyAndOrderDesc() {
        List<Tweet> recentTweets = tweetRepository.findAllByOrderByCreatedAtDesc();
        assertThat(recentTweets).isNotEmpty();
        
        Tweet mostRecent = recentTweets.getFirst();
        assertThat(mostRecent.getAuthor()).isEqualTo("SeedUser");
        assertThat(mostRecent.getContent()).isEqualTo("hello world 00001");
        
        Tweet secondMostRecent = recentTweets.get(1);
        assertThat(secondMostRecent.getAuthor()).isEqualTo("OliverUser");
        assertThat(secondMostRecent.getContent()).isEqualTo("hello world 00002");
    }
}