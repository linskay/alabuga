package com.example.alabuga.entity;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Тип миссии")
public enum MissionType {
    @Schema(description = "Квест")
    QUEST,
    
    @Schema(description = "Челлендж")
    CHALLENGE,
    
    @Schema(description = "Тест")
    TEST,
    
    @Schema(description = "Симуляция")
    SIMULATION
}
