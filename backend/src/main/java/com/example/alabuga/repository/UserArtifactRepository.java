package com.example.alabuga.repository;

import com.example.alabuga.entity.UserArtifact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserArtifactRepository extends JpaRepository<UserArtifact, Long> {
    
    List<UserArtifact> findByUserId(Long userId);
    
    List<UserArtifact> findByUserIdAndIsEquipped(Long userId, Boolean isEquipped);
    
    @Query("SELECT ua FROM UserArtifact ua WHERE ua.user.id = :userId AND ua.artifact.rarity = :rarity")
    List<UserArtifact> findByUserIdAndArtifactRarity(@Param("userId") Long userId, @Param("rarity") String rarity);
}
