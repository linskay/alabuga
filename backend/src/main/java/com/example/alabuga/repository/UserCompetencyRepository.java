package com.example.alabuga.repository;

import com.example.alabuga.entity.UserCompetency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCompetencyRepository extends JpaRepository<UserCompetency, Long> {
    
    List<UserCompetency> findByUserId(Long userId);
    
    Optional<UserCompetency> findByUserIdAndCompetencyId(Long userId, Long competencyId);
    
    @Query("SELECT uc FROM UserCompetency uc WHERE uc.user.id = :userId AND uc.currentLevel >= :minLevel")
    List<UserCompetency> findByUserIdAndCurrentLevelGreaterThanEqual(@Param("userId") Long userId, @Param("minLevel") Integer minLevel);
}
