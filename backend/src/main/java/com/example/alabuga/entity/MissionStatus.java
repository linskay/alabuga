package com.example.alabuga.entity;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Статус выполнения миссии")
public enum MissionStatus {
    @Schema(description = "Не начата")
    NOT_STARTED,
    
    @Schema(description = "В процессе")
    IN_PROGRESS,
    
    @Schema(description = "Завершена")
    COMPLETED,
    
    @Schema(description = "Провалена")
    FAILED
}
