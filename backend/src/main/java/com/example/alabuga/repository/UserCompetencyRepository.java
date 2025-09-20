package com.example.alabuga.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.UserCompetency;

@Repository
public interface UserCompetencyRepository extends JpaRepository<UserCompetency, Long> {
    
    List<UserCompetency> findByUserId(Long userId);
    
    Optional<UserCompetency> findByUserIdAndCompetencyId(Long userId, Long competencyId);
    
    @Query("SELECT uc FROM UserCompetency uc WHERE uc.user.id = :userId AND uc.experiencePoints >= :minExperience")
    List<UserCompetency> findByUserIdAndExperiencePointsGreaterThanEqual(@Param("userId") Long userId, @Param("minExperience") Integer minExperience);
}
