package com.example.alabuga.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.alabuga.entity.ShopItem;

@Repository
public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {
    
    List<ShopItem> findByIsActive(Boolean isActive);
    
    List<ShopItem> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT si FROM ShopItem si WHERE si.isActive = true AND (si.stockQuantity IS NULL OR si.stockQuantity > 0)")
    List<ShopItem> findAvailableItems();
    
    boolean existsByNameIgnoreCase(String name);
    
}
