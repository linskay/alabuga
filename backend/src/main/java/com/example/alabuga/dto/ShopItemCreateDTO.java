package com.example.alabuga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для создания товара магазина")
public class ShopItemCreateDTO {

    @NotBlank(message = "Название товара не может быть пустым")
    @Size(max = 100, message = "Название товара не может превышать 100 символов")
    @Schema(description = "Название товара", example = "Чертеж Космического Двигателя", required = true)
    private String name;

    @Size(max = 500, message = "Описание товара не может превышать 500 символов")
    @Schema(description = "Описание товара", example = "Позволяет построить мощный двигатель для космических кораблей")
    private String description;

    @NotNull(message = "Цена обязательна")
    @Positive(message = "Цена должна быть положительной")
    @Schema(description = "Цена в Энергонах", example = "500", required = true)
    private Integer price;

    @Size(max = 500, message = "URL изображения не может превышать 500 символов")
    @Schema(description = "URL изображения товара", example = "https://example.com/images/blueprint-engine.jpg")
    private String imageUrl;

    @Builder.Default
    @Schema(description = "Активен ли товар", example = "true", defaultValue = "true")
    private Boolean isActive = true;

    @Schema(description = "Количество на складе (null = неограниченно)", example = "10")
    private Integer stockQuantity;
}
