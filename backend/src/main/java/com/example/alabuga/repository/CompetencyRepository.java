package com.example.alabuga.repository;

import com.example.alabuga.entity.Competency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompetencyRepository extends JpaRepository<Competency, Long> {
    
    List<Competency> findByIsActive(Boolean isActive);
    
    List<Competency> findByNameContainingIgnoreCase(String name);
}
