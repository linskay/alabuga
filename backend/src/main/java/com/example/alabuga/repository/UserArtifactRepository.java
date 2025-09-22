package com.example.alabuga.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.UserArtifact;

@Repository
public interface UserArtifactRepository extends JpaRepository<UserArtifact, Long> {
    
    @Query("SELECT ua FROM UserArtifact ua WHERE ua.user.id = :userId")
    List<UserArtifact> findByUserId(@Param("userId") Long userId);
    
    List<UserArtifact> findByUserIdAndIsEquipped(Long userId, Boolean isEquipped);
    
    Optional<UserArtifact> findByUserIdAndArtifactId(Long userId, Long artifactId);
    
    @Query("SELECT ua FROM UserArtifact ua WHERE ua.user.id = :userId AND ua.artifact.rarity = :rarity")
    List<UserArtifact> findByUserIdAndArtifactRarity(@Param("userId") Long userId, @Param("rarity") String rarity);
}
