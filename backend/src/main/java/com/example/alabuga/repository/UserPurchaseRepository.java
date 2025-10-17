package com.example.alabuga.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.UserPurchase;

@Repository
public interface UserPurchaseRepository extends JpaRepository<UserPurchase, Long> {
    
    List<UserPurchase> findByUserIdOrderByPurchasedAtDesc(Long userId);
}
