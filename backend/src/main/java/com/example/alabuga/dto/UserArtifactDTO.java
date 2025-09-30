package com.example.alabuga.dto;

import com.example.alabuga.entity.Artifact.ArtifactRarity;

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
    
    @Schema(description = "ID артефакта", example = "1")
    private Long id;
    
    @Schema(description = "Название артефакта", example = "Меч Кодера")
    private String name;
    
    @Schema(description = "Краткое описание артефакта", example = "Увеличивает скорость программирования")
    private String shortDescription;
    
    @Schema(description = "URL изображения артефакта", example = "https://example.com/images/sword-coder.jpg")
    private String imageUrl;
    
    @Schema(description = "Редкость артефакта", example = "LEGENDARY")
    private ArtifactRarity rarity;
    
    @Schema(description = "Экипирован ли артефакт", example = "true")
    private Boolean isEquipped;
    
    @Schema(description = "Дата получения артефакта", example = "2024-01-15T10:30:00")
    private String acquiredAt;
}