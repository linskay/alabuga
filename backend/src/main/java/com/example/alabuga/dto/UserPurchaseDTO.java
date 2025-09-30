package com.example.alabuga.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для истории покупок пользователя")
public class UserPurchaseDTO {
    
    @Schema(description = "ID покупки", example = "1")
    private Long id;
    
    @Schema(description = "Название товара", example = "Квантовый модуль")
    private String itemName;
    
    @Schema(description = "Описание товара", example = "Ускоряет навигацию по гиперпространству")
    private String itemDescription;
    
    @Schema(description = "Цена, которую заплатил пользователь", example = "150")
    private Integer pricePaid;
    
    @Schema(description = "Остаток энергонов после покупки", example = "350")
    private Integer energyAfter;
    
    @Schema(description = "Дата покупки", example = "2025-01-20T12:34:27")
    private LocalDateTime purchasedAt;
}
