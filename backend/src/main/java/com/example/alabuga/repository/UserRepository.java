package com.example.alabuga.repository;

import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByLogin(String login);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByLogin(String login);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.login = :login AND u.isActive = true")
    Optional<User> findActiveUserByLogin(@Param("login") String login);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByIsActive(Boolean isActive);
    
    @Query("SELECT u FROM User u WHERE u.rank >= :minRank ORDER BY u.rank DESC")
    List<User> findByRankGreaterThanEqualOrderByRankDesc(@Param("minRank") Integer minRank);
    
    @Query("SELECT u FROM User u WHERE u.experience >= :minExperience ORDER BY u.experience DESC")
    List<User> findByExperienceGreaterThanEqualOrderByExperienceDesc(@Param("minExperience") Integer minExperience);
    
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
}
