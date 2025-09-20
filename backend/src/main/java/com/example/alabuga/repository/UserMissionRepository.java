package com.example.alabuga.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.UserMission;

@Repository
public interface UserMissionRepository extends JpaRepository<UserMission, Long> {
    
    List<UserMission> findByUserId(Long userId);
    
    List<UserMission> findByMissionId(Long missionId);
    
    Optional<UserMission> findByUserIdAndMissionId(Long userId, Long missionId);
    
    @Query("SELECT um FROM UserMission um WHERE um.user.id = :userId AND um.status = :status")
    List<UserMission> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
    
    @Query("SELECT um FROM UserMission um WHERE um.user.id = :userId AND um.mission.branchId = :branchId")
    List<UserMission> findByUserIdAndBranchId(@Param("userId") Long userId, @Param("branchId") Long branchId);
}
