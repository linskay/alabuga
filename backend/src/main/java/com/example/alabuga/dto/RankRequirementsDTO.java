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
@Schema(description = "DTO для требований ранга")
public class RankRequirementsDTO {
    
    @Schema(description = "Уникальный идентификатор требований", example = "1")
    private Long id;
    
    @Schema(description = "Уровень ранга", example = "1")
    private Integer rankLevel;
    
    @Schema(description = "Название ранга", example = "Навигатор Траекторий")
    private String rankName;
    
    @Schema(description = "Требуемый опыт", example = "1000")
    private Integer requiredExperience;
    
    @Schema(description = "Название обязательной миссии", example = "Основы навигации")
    private String requiredMissionName;
    
    @Schema(description = "Требуемые очки в компетенциях", example = "100")
    private Integer requiredCompetencyPoints;
    
    @Schema(description = "Названия компетенций", example = "[\"navigation\", \"engineering\"]")
    private String competencyNames;
    
    @Schema(description = "Активны ли требования", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Описание требований", example = "Требуется выполнить миссию по навигации и набрать 100 очков в компетенциях")
    private String description;
}
