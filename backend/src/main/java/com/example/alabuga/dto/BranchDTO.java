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
@Schema(description = "DTO ветки миссий")
public class BranchDTO {
    
    @Schema(description = "ID ветки", example = "1")
    private Long id;
    
    @Schema(description = "Название ветки", example = "Док Лунной Базы")
    private String name;
    
    @Schema(description = "Краткое описание", example = "Базовые квесты")
    private String shortDescription;
    
    @Schema(description = "Полное описание", example = "Базовые квесты для знакомства с системой")
    private String description;
}
