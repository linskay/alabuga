package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.ShopItemCreateDTO;
import com.example.alabuga.dto.ShopItemDTO;
import com.example.alabuga.dto.ShopItemUpdateDTO;
import com.example.alabuga.entity.ShopItem;

@Component
public class ShopItemMapper {
    
    public ShopItemDTO toDTO(ShopItem shopItem) {
        if (shopItem == null) {
            return null;
        }
        
        return ShopItemDTO.builder()
                .id(shopItem.getId())
                .name(shopItem.getName())
                .description(shopItem.getDescription())
                .price(shopItem.getPrice())
                .imageUrl(shopItem.getImageUrl())
                .isActive(shopItem.getIsActive())
                .stockQuantity(shopItem.getStockQuantity())
                .build();
    }
    
    public List<ShopItemDTO> toDTOList(List<ShopItem> shopItems) {
        if (shopItems == null) {
            return null;
        }
        
        return shopItems.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public ShopItem toEntity(ShopItemCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Boolean isActive = dto.getIsActive();
        if (isActive == null) {
            isActive = Boolean.TRUE;
        }

        return ShopItem.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .isActive(isActive)
                .stockQuantity(dto.getStockQuantity())
                .build();
    }

    public void updateEntity(ShopItem shopItem, ShopItemUpdateDTO dto) {
        if (shopItem == null || dto == null) {
            return;
        }

        if (dto.getName() != null) {
            shopItem.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            shopItem.setDescription(dto.getDescription());
        }
        if (dto.getPrice() != null) {
            shopItem.setPrice(dto.getPrice());
        }
        if (dto.getImageUrl() != null) {
            shopItem.setImageUrl(dto.getImageUrl());
        }
        if (dto.getIsActive() != null) {
            shopItem.setIsActive(dto.getIsActive());
        }
        if (dto.getStockQuantity() != null) {
            shopItem.setStockQuantity(dto.getStockQuantity());
        }
    }
}
