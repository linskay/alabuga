package com.example.alabuga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "DTO для обновления миссии")
public class MissionUpdateDTO {

    @Size(max = 200, message = "Название миссии не может превышать 200 символов")
    @Schema(description = "Название миссии", example = "Первые шаги в космосе")
    private String name;

    @Size(max = 1000, message = "Описание миссии не может превышать 1000 символов")
    @Schema(description = "Описание миссии", example = "Изучите основы космических путешествий")
    private String description;

    @Schema(description = "ID ветки миссии", example = "1")
    private Long branchId;

    @Schema(description = "Тип миссии", example = "TUTORIAL")
    private String type;

    @Schema(description = "Сложность миссии", example = "EASY")
    private String difficulty;

    @Positive(message = "Награда опыта должна быть положительной")
    @Schema(description = "Награда опыта", example = "50")
    private Integer experienceReward;

    @Positive(message = "Награда маны должна быть положительной")
    @Schema(description = "Награда маны", example = "25")
    private Integer manaReward;

    @Size(max = 500, message = "Требуемые компетенции не могут превышать 500 символов")
    @Schema(description = "Требуемые компетенции (JSON)", example = "[\"navigation\", \"engineering\"]")
    private String requiredCompetencies;

    @Schema(description = "Активна ли миссия", example = "true")
    private Boolean isActive;

    @Schema(description = "Требует ли миссия модерации", example = "false")
    private Boolean requiresModeration;

    @Schema(description = "ID артефакта в качестве награды", example = "1")
    private Long artifactRewardId;
}
