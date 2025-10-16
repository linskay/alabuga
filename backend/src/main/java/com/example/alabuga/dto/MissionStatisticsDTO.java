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
@Schema(description = "DTO статистики по миссии")
public class MissionStatisticsDTO {
    @Schema(description = "ID миссии", example = "1")
    private Long missionId;

    @Schema(description = "Название миссии", example = "Первые шаги в космосе")
    private String missionName;

    @Schema(description = "Дата создания миссии (если доступна)")
    private String missionCreatedAt;

    @Schema(description = "Сколько раз миссия назначалась пользователям")
    private Long assignedTotal;

    @Schema(description = "Сколько раз миссия была завершена")
    private Long completedTotal;

    @Schema(description = "Сколько уникальных пользователей сейчас выполняют миссию (IN_PROGRESS)")
    private Long inProgressUsers;

    @Schema(description = "Сколько уникальных пользователей получили назначение по этой миссии")
    private Long uniqueAssignees;
}
