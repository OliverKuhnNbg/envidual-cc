package com.envidual.tweets_app.domain.repository ;

import com.envidual.tweets_app.domain.model.Tweet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/*
 * ADR: Direct Spring Data JPA Integration in Domain
 * Context: As we decided to map JPA directly onto the domain model, creating an abstract domain repository interface and a separate Spring infrastructure implementation yields no architectural value.
 * Decision: The domain repository directly extends Spring Data's JpaRepository.
 * Consequence: The core domain now has a hard dependency on Spring Data. While this violates strict dependency inversion, it significantly accelerates delivery and reduces structural complexity for straightforward bounded contexts.
 */
@Repository
public interface TweetRepository extends JpaRepository<Tweet, UUID> {
    
    List<Tweet> findAllByOrderByCreatedAtDesc();

    // Spring Data generiert hieraus automatisch ein SQL ILIKE (Case-Insensitive Search)
    List<Tweet> findByContentContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
    
}