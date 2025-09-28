package com.example.alabuga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @Schema(description = "Название товара", example = "Чертеж Космического Двигателя", required = true)
    @NotBlank(message = "Название товара не может быть пустым")
    @Size(min = 1, max = 200, message = "Название товара должно содержать от 1 до 200 символов")
    private String name;

    @Schema(description = "Описание товара", example = "Позволяет построить мощный двигатель для космических кораблей")
    @Size(max = 1000, message = "Описание товара не может превышать 1000 символов")
    private String description;

    @Schema(description = "Цена в Энергонах", example = "500", required = true)
    @NotNull(message = "Цена товара обязательна")
    @Min(value = 0, message = "Цена товара не может быть отрицательной")
    private Integer price;

    @Schema(description = "URL изображения товара", example = "https://example.com/images/blueprint-engine.jpg")
    @Size(max = 500, message = "URL изображения не может превышать 500 символов")
    private String imageUrl;

    @Schema(description = "Активен ли товар", example = "true")
    @NotNull(message = "Статус активности обязателен")
    private Boolean isActive;

    @Schema(description = "Количество на складе", example = "10")
    @Min(value = 0, message = "Количество на складе не может быть отрицательным")
    private Integer stockQuantity;
}
