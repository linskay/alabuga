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
    
    @Schema(description = "Описание артефакта", example = "Легендарный меч, увеличивающий скорость программирования")
    private String description;
    
    @Schema(description = "Редкость артефакта", example = "LEGENDARY")
    private ArtifactRarity rarity;
    
    @Schema(description = "Уровень силы артефакта", example = "100")
    private Integer powerLevel;
    
    @Schema(description = "Активен ли артефакт", example = "true")
    private Boolean isActive;
}
