package com.example.alabuga.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "shop_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Сущность товара магазина Нексус")
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор товара", example = "1")
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    @Schema(description = "Название товара", example = "Чертеж Космического Двигателя")
    private String name;

    @Column(name = "description", length = 500)
    @Schema(description = "Описание товара", example = "Позволяет построить мощный двигатель для космических кораблей")
    private String description;

    @Column(name = "price", nullable = false)
    @Schema(description = "Цена в Энергонах", example = "500")
    private Integer price;

    @Column(name = "image_url", length = 500)
    @Schema(description = "URL изображения товара", example = "https://example.com/images/blueprint-engine.jpg")
    private String imageUrl;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    @Schema(description = "Активен ли товар", example = "true")
    private Boolean isActive = true;

    @Column(name = "stock_quantity")
    @Schema(description = "Количество на складе (null = неограниченно)", example = "10")
    private Integer stockQuantity;
}