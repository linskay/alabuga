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
@Schema(description = "DTO для обновления требований ранга")
public class RankRequirementsUpdateDTO {

    @Positive(message = "Уровень ранга должен быть положительным")
    @Schema(description = "Уровень ранга", example = "1")
    private Integer rankLevel;

    @Positive(message = "Требуемый опыт должен быть положительным")
    @Schema(description = "Требуемый опыт", example = "1000")
    private Integer requiredExperience;

    @Size(max = 200, message = "Название миссии не может превышать 200 символов")
    @Schema(description = "Название обязательной миссии", example = "Основы навигации")
    private String requiredMissionName;

    @Positive(message = "Требуемые очки в компетенциях должны быть положительными")
    @Schema(description = "Требуемые очки в компетенциях", example = "100")
    private Integer requiredCompetencyPoints;

    @Size(max = 500, message = "Названия компетенций не могут превышать 500 символов")
    @Schema(description = "Названия компетенций (JSON)", example = "[\"navigation\", \"engineering\"]")
    private String competencyNames;

    @Schema(description = "Активны ли требования", example = "true")
    private Boolean isActive;

    @Size(max = 500, message = "Описание не может превышать 500 символов")
    @Schema(description = "Описание требований", example = "Требуется выполнить миссию по навигации и набрать 100 очков в компетенциях")
    private String description;
}
