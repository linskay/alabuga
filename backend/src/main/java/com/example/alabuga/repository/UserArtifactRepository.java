package com.example.alabuga.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.UserArtifact;

@Repository
public interface UserArtifactRepository extends JpaRepository<UserArtifact, Long> {
    
    List<UserArtifact> findByUserId(Long userId);
    
    List<UserArtifact> findByUserIdAndIsEquippedTrue(Long userId);
    
    UserArtifact findByUserIdAndArtifactId(Long userId, Long artifactId);
    
    @Query("SELECT COUNT(ua) FROM UserArtifact ua WHERE ua.user.id = :userId AND ua.isEquipped = true")
    long countEquippedArtifactsByUserId(@Param("userId") Long userId);
    
    boolean existsByUserIdAndArtifactId(Long userId, Long artifactId);
}