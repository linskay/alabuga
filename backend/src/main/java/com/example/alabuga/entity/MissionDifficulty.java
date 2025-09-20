package com.example.alabuga.entity;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Сложность миссии")
public enum MissionDifficulty {
    @Schema(description = "Легкая")
    EASY,
    
    @Schema(description = "Средняя")
    MEDIUM,
    
    @Schema(description = "Сложная")
    HARD,
    
    @Schema(description = "Экспертная")
    EXPERT
}
