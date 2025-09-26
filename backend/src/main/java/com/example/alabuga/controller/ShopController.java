package com.example.alabuga.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.alabuga.dto.PurchaseDTO;
import com.example.alabuga.dto.ShopItemCreateDTO;
import com.example.alabuga.dto.ShopItemDTO;
import com.example.alabuga.dto.ShopItemUpdateDTO;
import com.example.alabuga.service.ShopService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shop")
@Tag(name = "Nexus Shop Management", description = "API для управления магазином Нексус")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping
    @Operation(summary = "Получить все товары магазина")
    public ResponseEntity<List<ShopItemDTO>> getAllShopItems() {
        List<ShopItemDTO> shopItems = shopService.getAllShopItems();
        return ResponseEntity.ok(shopItems);
    }

    @GetMapping("/available")
    @Operation(summary = "Получить доступные товары")
    public ResponseEntity<List<ShopItemDTO>> getAvailableItems() {
        List<ShopItemDTO> shopItems = shopService.getAvailableItems();
        return ResponseEntity.ok(shopItems);
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск товаров по названию")
    public ResponseEntity<List<ShopItemDTO>> searchItemsByName(
            @Parameter(description = "Название для поиска") @RequestParam String name) {
        List<ShopItemDTO> shopItems = shopService.searchItemsByName(name);
        return ResponseEntity.ok(shopItems);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить товар по ID")
    public ResponseEntity<ShopItemDTO> getShopItemById(
            @Parameter(description = "ID товара") @PathVariable Long id) {
        ShopItemDTO shopItem = shopService.getShopItemById(id);
        return ResponseEntity.ok(shopItem);
    }

    @PostMapping
    @Operation(summary = "Создать товар (только для админов)")
    public ResponseEntity<ShopItemDTO> createShopItem(@Valid @RequestBody ShopItemCreateDTO shopItemCreateDTO) {
        ShopItemDTO shopItem = shopService.createShopItem(shopItemCreateDTO);
        return ResponseEntity.ok(shopItem);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить товар (только для админов)")
    public ResponseEntity<ShopItemDTO> updateShopItem(
            @Parameter(description = "ID товара") @PathVariable Long id,
            @Valid @RequestBody ShopItemUpdateDTO shopItemUpdateDTO) {
        ShopItemDTO shopItem = shopService.updateShopItem(id, shopItemUpdateDTO);
        return ResponseEntity.ok(shopItem);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить товар (только для админов)")
    public ResponseEntity<Void> deleteShopItem(
            @Parameter(description = "ID товара") @PathVariable Long id) {
        shopService.deleteShopItem(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/toggle-status")
    @Operation(summary = "Переключить статус товара (только для админов)")
    public ResponseEntity<ShopItemDTO> toggleShopItemStatus(
            @Parameter(description = "ID товара") @PathVariable Long id) {
        ShopItemDTO shopItem = shopService.toggleShopItemStatus(id);
        return ResponseEntity.ok(shopItem);
    }

    @PostMapping("/purchase")
    @Operation(summary = "Купить товар в Нексусе")
    public ResponseEntity<PurchaseDTO> purchaseItem(
            @Parameter(description = "ID пользователя") @RequestParam Long userId,
            @Parameter(description = "ID товара") @RequestParam Long shopItemId) {
        PurchaseDTO purchase = shopService.purchaseItem(userId, shopItemId);
        return ResponseEntity.ok(purchase);
    }
}
