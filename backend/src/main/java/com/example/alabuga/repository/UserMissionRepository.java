package com.example.alabuga.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.MissionStatus;
import com.example.alabuga.entity.UserMission;

@Repository
public interface UserMissionRepository extends JpaRepository<UserMission, Long> {
    
    List<UserMission> findByUserId(Long userId);
    
    List<UserMission> findByMissionId(Long missionId);
    
    Optional<UserMission> findByUserIdAndMissionId(Long userId, Long missionId);
    
    @Query("SELECT um FROM UserMission um WHERE um.user.id = :userId AND um.status = :status")
    List<UserMission> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") MissionStatus status);
    
    @Query("SELECT um FROM UserMission um WHERE um.user.id = :userId AND um.mission.branchId = :branchId")
    List<UserMission> findByUserIdAndBranchId(@Param("userId") Long userId, @Param("branchId") Long branchId);
    
    List<UserMission> findByMissionIdAndStatusIn(Long missionId, List<MissionStatus> statuses);
    
    long countByStatus(MissionStatus status);
    
    @Query("SELECT COUNT(um) FROM UserMission um WHERE um.status = :status AND um.completedAt BETWEEN :start AND :end")
    long countByStatusAndCompletedAtBetween(@Param("status") MissionStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Mission statistics
    long countByMissionId(Long missionId);

    long countByMissionIdAndStatus(Long missionId, MissionStatus status);

    @Query("SELECT COUNT(DISTINCT um.user.id) FROM UserMission um WHERE um.mission.id = :missionId")
    long countDistinctAssigneesByMissionId(@Param("missionId") Long missionId);

    @Query("SELECT COUNT(DISTINCT um.user.id) FROM UserMission um WHERE um.mission.id = :missionId AND um.status = :status")
    long countDistinctUsersByMissionIdAndStatus(@Param("missionId") Long missionId, @Param("status") MissionStatus status);
}
