package com.example.alabuga.repository;

import com.example.alabuga.entity.Artifact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtifactRepository extends JpaRepository<Artifact, Long> {
    
    List<Artifact> findByIsActive(Boolean isActive);
    
    List<Artifact> findByRarity(Artifact.ArtifactRarity rarity);
    
    List<Artifact> findByNameContainingIgnoreCase(String name);
}
