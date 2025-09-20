package com.example.alabuga.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для прогресса пользователя по миссии")
public class UserMissionDTO {

    @Schema(description = "Уникальный идентификатор", example = "1")
    private Long id;

    @Schema(description = "ID пользователя", example = "1")
    private Long userId;

    @Schema(description = "ID миссии", example = "1")
    private Long missionId;

    @Schema(description = "Название миссии", example = "Первые шаги в космосе")
    private String missionName;

    @Schema(description = "Название ветки", example = "Док Лунной Базы")
    private String branchName;

    @Schema(description = "Статус выполнения миссии")
    private String status;

    @Schema(description = "Прогресс выполнения (0-100)", example = "75")
    private Integer progress;

    @Schema(description = "Дата начала выполнения")
    private LocalDateTime startedAt;

    @Schema(description = "Дата завершения")
    private LocalDateTime completedAt;

    @Schema(description = "Заметки пользователя", example = "Сложная миссия, но интересная")
    private String notes;
}
