package com.example.alabuga.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.UserCard;

@Repository
public interface UserCardRepository extends JpaRepository<UserCard, Long> {
    
    List<UserCard> findByUserId(Long userId);
    
    List<UserCard> findByUserIdAndCardIsActiveTrue(Long userId);
    
    Optional<UserCard> findByUserIdAndCardId(Long userId, Long cardId);
    
    boolean existsByUserIdAndCardId(Long userId, Long cardId);
    
    @Query("SELECT uc FROM UserCard uc WHERE uc.user.id = :userId AND uc.card.isActive = true ORDER BY uc.obtainedAt DESC")
    List<UserCard> findUserCardsOrderedByObtainedDate(@Param("userId") Long userId);
    
    @Query("SELECT uc FROM UserCard uc WHERE uc.user.id = :userId AND uc.card.seriesName = :seriesName AND uc.card.isActive = true ORDER BY uc.obtainedAt DESC")
    List<UserCard> findUserCardsBySeries(@Param("userId") Long userId, @Param("seriesName") String seriesName);
}
