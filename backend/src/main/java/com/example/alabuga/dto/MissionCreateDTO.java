package com.example.alabuga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@Schema(description = "DTO для создания миссии")
public class MissionCreateDTO {

    @NotBlank(message = "Название миссии не может быть пустым")
    @Size(max = 200, message = "Название миссии не может превышать 200 символов")
    @Schema(description = "Название миссии", example = "Первые шаги в космосе", required = true)
    private String name;

    @Size(max = 1000, message = "Описание миссии не может превышать 1000 символов")
    @Schema(description = "Описание миссии", example = "Изучите основы космических путешествий")
    private String description;

    @NotNull(message = "ID ветки миссии обязателен")
    @Schema(description = "ID ветки миссии", example = "1", required = true)
    private Long branchId;

    @NotNull(message = "Тип миссии обязателен")
    @Schema(description = "Тип миссии", example = "TUTORIAL", required = true)
    private String type;

    @NotNull(message = "Сложность миссии обязательна")
    @Schema(description = "Сложность миссии", example = "EASY", required = true)
    private String difficulty;

    @NotNull(message = "Награда опыта обязательна")
    @Positive(message = "Награда опыта должна быть положительной")
    @Schema(description = "Награда опыта", example = "50", required = true)
    private Integer experienceReward;

    @NotNull(message = "Награда Энергонов обязательна")
    @Positive(message = "Награда Энергонов должна быть положительной")
    @Schema(description = "Награда Энергонов", example = "25", required = true)
    private Integer energyReward;

    @Size(max = 500, message = "Требуемые компетенции не могут превышать 500 символов")
    @Schema(description = "Требуемые компетенции (JSON)", example = "[\"navigation\", \"engineering\"]")
    private String requiredCompetencies;

    @Builder.Default
    @Schema(description = "Активна ли миссия", example = "true", defaultValue = "true")
    private Boolean isActive = true;

    @Builder.Default
    @Schema(description = "Требует ли миссия модерации", example = "false", defaultValue = "false")
    private Boolean requiresModeration = false;

    @Schema(description = "ID артефакта в качестве награды", example = "1")
    private Long artifactRewardId;
}
