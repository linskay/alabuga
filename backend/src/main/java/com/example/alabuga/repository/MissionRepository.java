package com.example.alabuga.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.Mission;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {
    
    List<Mission> findByBranchId(Long branchId);
    
    List<Mission> findByIsActive(Boolean isActive);
    
    List<Mission> findByBranchIdAndIsActive(Long branchId, Boolean isActive);
    
    @Query("SELECT m FROM Mission m WHERE m.name LIKE %:name%")
    List<Mission> findByNameContainingIgnoreCase(@Param("name") String name);
    
    @Query("SELECT m FROM Mission m WHERE m.branchId = :branchId AND m.isActive = true")
    List<Mission> findActiveMissionsByBranch(@Param("branchId") Long branchId);
}
