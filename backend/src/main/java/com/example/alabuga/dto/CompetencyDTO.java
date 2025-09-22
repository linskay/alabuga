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
@Schema(description = "DTO для компетенции")
public class CompetencyDTO {
    
    @Schema(description = "Уникальный идентификатор компетенции", example = "1")
    private Long id;
    
    @Schema(description = "Название компетенции", example = "Сила Миссии")
    private String name;

    @Schema(description = "Краткое описание компетенции", example = "Вера в дело")
    private String shortDescription;

    @Schema(description = "Полное описание компетенции", example = "Умение держать курс даже тогда, когда звёзды гаснут. Показывает преданность цели и устойчивость в испытаниях.")
    private String description;
    
    
    @Schema(description = "Активна ли компетенция", example = "true")
    private Boolean isActive;
}
