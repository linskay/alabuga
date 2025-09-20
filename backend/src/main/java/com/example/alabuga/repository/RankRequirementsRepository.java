package com.example.alabuga.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.RankRequirements;

@Repository
public interface RankRequirementsRepository extends JpaRepository<RankRequirements, Long> {
    
    Optional<RankRequirements> findByRankLevel(Integer rankLevel);
    
    List<RankRequirements> findByIsActive(Boolean isActive);
    
    List<RankRequirements> findByRankLevelGreaterThan(Integer rankLevel);
}
