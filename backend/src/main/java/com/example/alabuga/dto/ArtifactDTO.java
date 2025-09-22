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
@Schema(description = "DTO для артефакта")
public class ArtifactDTO {
    
    @Schema(description = "Уникальный идентификатор артефакта", example = "1")
    private Long id;
    
    @Schema(description = "Название артефакта", example = "Меч Кодера")
    private String name;
    
    @Schema(description = "Краткое описание артефакта", example = "За успешное завершение миссии приведи друга")
    private String shortDescription;
    
    @Schema(description = "URL изображения артефакта", example = "https://example.com/images/sword-coder.jpg")
    private String imageUrl;
    
    @Schema(description = "Редкость артефакта", example = "LEGENDARY")
    private ArtifactRarity rarity;
    
    @Schema(description = "Активен ли артефакт", example = "true")
    private Boolean isActive;
}