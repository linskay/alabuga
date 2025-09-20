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
@Schema(description = "DTO для артефакта пользователя")
public class UserArtifactDTO {
    
    @Schema(description = "Уникальный идентификатор записи", example = "1")
    private Long id;
    
    @Schema(description = "ID пользователя", example = "1")
    private Long userId;
    
    @Schema(description = "ID артефакта", example = "1")
    private Long artifactId;
    
    @Schema(description = "Название артефакта", example = "Меч Кодера")
    private String artifactName;
    
    @Schema(description = "Описание артефакта", example = "Легендарный меч, увеличивающий скорость программирования")
    private String artifactDescription;
    
    @Schema(description = "Редкость артефакта", example = "LEGENDARY")
    private String artifactRarity;
    
    @Schema(description = "Экипирован ли артефакт", example = "true")
    private Boolean isEquipped;
    
    @Schema(description = "Активен ли артефакт у пользователя", example = "true")
    private Boolean isActive;
}
