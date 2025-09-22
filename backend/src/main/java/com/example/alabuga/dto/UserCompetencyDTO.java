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
@Schema(description = "DTO для компетенции пользователя")
public class UserCompetencyDTO {
    
    @Schema(description = "Уникальный идентификатор записи", example = "1")
    private Long id;
    
    @Schema(description = "ID пользователя", example = "1")
    private Long userId;
    
    @Schema(description = "ID компетенции", example = "1")
    private Long competencyId;
    
    @Schema(description = "Название компетенции", example = "Сила Миссии")
    private String competencyName;

    @Schema(description = "Краткое описание компетенции", example = "Вера в дело")
    private String competencyShortDescription;

    @Schema(description = "Полное описание компетенции", example = "Умение держать курс даже тогда, когда звёзды гаснут. Показывает преданность цели и устойчивость в испытаниях.")
    private String competencyDescription;
    
    
    @Schema(description = "Очки опыта в компетенции", example = "9500")
    private Integer experiencePoints;
    
    @Schema(description = "Активна ли компетенция у пользователя", example = "true")
    private Boolean isActive;
}
