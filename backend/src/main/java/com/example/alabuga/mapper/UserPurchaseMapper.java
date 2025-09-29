package com.example.alabuga.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.UserPurchaseDTO;
import com.example.alabuga.entity.UserPurchase;

@Component
public class UserPurchaseMapper {
    
    public UserPurchaseDTO toDTO(UserPurchase userPurchase) {
        return UserPurchaseDTO.builder()
                .id(userPurchase.getId())
                .itemName(userPurchase.getShopItem().getName())
                .itemDescription(userPurchase.getShopItem().getDescription())
                .pricePaid(userPurchase.getPricePaid())
                .energyAfter(userPurchase.getEnergyAfter())
                .purchasedAt(userPurchase.getPurchasedAt())
                .build();
    }
    
    public List<UserPurchaseDTO> toDTOList(List<UserPurchase> userPurchases) {
        return userPurchases.stream()
                .map(this::toDTO)
                .toList();
    }
}
