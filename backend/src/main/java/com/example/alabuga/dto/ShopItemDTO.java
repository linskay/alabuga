package com.example.alabuga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для товара магазина")
public class ShopItemDTO {
    
    @Schema(description = "Уникальный идентификатор товара", example = "1")
    private Long id;
    
    @Schema(description = "Название товара", example = "Чертеж Космического Двигателя")
    private String name;
    
    @Schema(description = "Описание товара", example = "Позволяет построить мощный двигатель для космических кораблей")
    private String description;
    
    @Schema(description = "Цена в Энергонах", example = "500")
    private Integer price;
    
    @Schema(description = "URL изображения товара", example = "https://example.com/images/blueprint-engine.jpg")
    private String imageUrl;
    
    @Schema(description = "Активен ли товар", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Количество на складе", example = "10")
    private Integer stockQuantity;
}
