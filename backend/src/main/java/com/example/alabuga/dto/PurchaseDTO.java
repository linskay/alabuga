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
@Schema(description = "DTO для покупки в магазине Нексус")
public class PurchaseDTO {
    
    @Schema(description = "ID товара", example = "1")
    private Long shopItemId;
    
    @Schema(description = "Название товара", example = "Чертеж Космического Двигателя")
    private String itemName;
    
    @Schema(description = "Цена в Энергонах", example = "500")
    private Integer price;
    
    @Schema(description = "ID пользователя", example = "1")
    private Long userId;
    
    @Schema(description = "Имя пользователя", example = "Командир")
    private String userName;
    
    @Schema(description = "Остаток Энергонов после покупки", example = "300")
    private Integer remainingEnergy;
    
    @Schema(description = "Сообщение подтверждения", example = "Для активации чертежа требуется 500 Энергонов. Подтвердить синтез в Нексусе?")
    private String confirmationMessage;
}
