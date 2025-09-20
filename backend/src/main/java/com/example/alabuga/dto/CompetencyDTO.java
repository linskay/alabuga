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
    
    @Schema(description = "Название компетенции", example = "Java Programming")
    private String name;
    
    @Schema(description = "Описание компетенции", example = "Программирование на Java")
    private String description;
    
    @Schema(description = "Максимальный уровень компетенции", example = "100")
    private Integer maxLevel;
    
    @Schema(description = "Активна ли компетенция", example = "true")
    private Boolean isActive;
}
