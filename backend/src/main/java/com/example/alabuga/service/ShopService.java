package com.example.alabuga.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.PurchaseDTO;
import com.example.alabuga.dto.ShopItemCreateDTO;
import com.example.alabuga.dto.ShopItemDTO;
import com.example.alabuga.dto.ShopItemUpdateDTO;
import com.example.alabuga.entity.ShopItem;
import com.example.alabuga.entity.User;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.ShopItemMapper;
import com.example.alabuga.repository.ShopItemRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShopService {
    
    private final ShopItemRepository shopItemRepository;
    private final UserRepository userRepository;
    private final ShopItemMapper shopItemMapper;
    private final NotificationService notificationService;
    
    public List<ShopItemDTO> getAllShopItems() {
        List<ShopItem> shopItems = shopItemRepository.findAll();
        return shopItemMapper.toDTOList(shopItems);
    }
    
    public List<ShopItemDTO> getAvailableItems() {
        List<ShopItem> shopItems = shopItemRepository.findAvailableItems();
        return shopItemMapper.toDTOList(shopItems);
    }
    
    
    public List<ShopItemDTO> searchItemsByName(String name) {
        List<ShopItem> shopItems = shopItemRepository.findByNameContainingIgnoreCase(name);
        return shopItemMapper.toDTOList(shopItems);
    }
    
    public ShopItemDTO getShopItemById(Long id) {
        ShopItem shopItem = shopItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Товар", id));
        return shopItemMapper.toDTO(shopItem);
    }
    
    @Transactional
    public ShopItemDTO createShopItem(ShopItemCreateDTO shopItemCreateDTO) {
        if (shopItemRepository.existsByNameIgnoreCase(shopItemCreateDTO.getName())) {
            throw new BusinessLogicException("Товар с названием '" + shopItemCreateDTO.getName() + "' уже существует");
        }
        
        ShopItem shopItem = shopItemMapper.toEntity(shopItemCreateDTO);
        ShopItem savedShopItem = shopItemRepository.save(shopItem);
        return shopItemMapper.toDTO(savedShopItem);
    }
    
    @Transactional
    public ShopItemDTO updateShopItem(Long id, ShopItemUpdateDTO shopItemUpdateDTO) {
        ShopItem shopItem = shopItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Товар", id));
        if (shopItemUpdateDTO.getName() != null && !shopItemUpdateDTO.getName().equals(shopItem.getName())) {
            if (shopItemRepository.existsByNameIgnoreCase(shopItemUpdateDTO.getName())) {
                throw new BusinessLogicException("Товар с названием '" + shopItemUpdateDTO.getName() + "' уже существует");
            }
        }
        
        shopItemMapper.updateEntity(shopItem, shopItemUpdateDTO);
        ShopItem savedShopItem = shopItemRepository.save(shopItem);
        return shopItemMapper.toDTO(savedShopItem);
    }
    
    @Transactional
    public void deleteShopItem(Long id) {
        ShopItem shopItem = shopItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Товар", id));
        
        shopItemRepository.delete(shopItem);
    }
    
    @Transactional
    public ShopItemDTO toggleShopItemStatus(Long id) {
        ShopItem shopItem = shopItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Товар", id));
        
        shopItem.setIsActive(!shopItem.getIsActive());
        ShopItem savedShopItem = shopItemRepository.save(shopItem);
        return shopItemMapper.toDTO(savedShopItem);
    }
    
    @Transactional
    public PurchaseDTO purchaseItem(Long userId, Long shopItemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        ShopItem shopItem = shopItemRepository.findById(shopItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Товар", shopItemId));
        
        // Проверяем, активен ли товар
        if (!shopItem.getIsActive()) {
            throw new BusinessLogicException("Товар недоступен для покупки");
        }
        
        // Проверяем наличие на складе
        if (shopItem.getStockQuantity() != null && shopItem.getStockQuantity() <= 0) {
            throw new BusinessLogicException("Товар закончился на складе");
        }
        
        // Проверяем, достаточно ли Энергонов
        if (user.getEnergy() < shopItem.getPrice()) {
            throw new BusinessLogicException("Недостаточно Энергонов для покупки");
        }
        
        // Списываем Энергоны
        user.setEnergy(user.getEnergy() - shopItem.getPrice());
        userRepository.save(user);
        
        // Уменьшаем количество на складе
        if (shopItem.getStockQuantity() != null) {
            shopItem.setStockQuantity(shopItem.getStockQuantity() - 1);
            shopItemRepository.save(shopItem);
        }
        
        // Создаем уведомление о покупке
        notificationService.createShopPurchaseNotification(user, shopItem.getName(), shopItem.getPrice());
        
        // Формируем сообщение подтверждения
        String confirmationMessage = String.format(
            "Для активации чертежа требуется %d Энергонов. Подтвердить синтез в Нексусе?", 
            shopItem.getPrice()
        );
        
        return PurchaseDTO.builder()
                .shopItemId(shopItem.getId())
                .itemName(shopItem.getName())
                .price(shopItem.getPrice())
                .userId(user.getId())
                .userName(user.getFirstName() + " " + user.getLastName())
                .remainingEnergy(user.getEnergy())
                .confirmationMessage(confirmationMessage)
                .build();
    }
}
