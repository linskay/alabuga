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
@Schema(description = "DTO для миссии")
public class MissionDTO {

    @Schema(description = "Уникальный идентификатор миссии", example = "1")
    private Long id;

    @Schema(description = "Название миссии", example = "Первые шаги в космосе")
    private String name;

    @Schema(description = "Описание миссии", example = "Изучите основы космических путешествий")
    private String description;

    @Schema(description = "ID ветки миссии", example = "1")
    private Long branchId;

    @Schema(description = "Название ветки", example = "Док Лунной Базы")
    private String branchName;

    @Schema(description = "Тип миссии")
    private String type;

    @Schema(description = "Сложность миссии")
    private String difficulty;

    @Schema(description = "Награда опыта", example = "50")
    private Integer experienceReward;

    @Schema(description = "Награда Энергонов", example = "25")
    private Integer energyReward;

    @Schema(description = "Минимальный ранг для доступа", example = "2")
    private Integer requiredRank;

    @Schema(description = "Минимальный опыт для доступа", example = "500")
    private Integer requiredExperience;

    @Schema(description = "Требуемые компетенции", example = "[\"navigation\", \"engineering\"]")
    private String requiredCompetencies;

    @Schema(description = "Активна ли миссия", example = "true")
    private Boolean isActive;

    @Schema(description = "Требует ли миссия модерации", example = "false")
    private Boolean requiresModeration;

    @Schema(description = "ID артефакта в качестве награды", example = "1")
    private Long artifactRewardId;

    @Schema(description = "URL изображения миссии", example = "https://example.com/images/mission1.jpg")
    private String imageUrl;
}
