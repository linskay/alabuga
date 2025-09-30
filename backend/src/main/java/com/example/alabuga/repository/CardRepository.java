package com.example.alabuga.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.Card;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    
    List<Card> findByIsActiveTrue();
    
    List<Card> findBySeriesNameAndIsActiveTrue(String seriesName);
    
    Optional<Card> findByNameAndIsActiveTrue(String name);
    
    @Query("SELECT c FROM Card c WHERE c.isActive = true AND c.unlockRank <= :userRank")
    List<Card> findAvailableCardsByRank(@Param("userRank") Integer userRank);
}
