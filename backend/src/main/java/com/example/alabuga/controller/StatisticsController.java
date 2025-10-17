package com.example.alabuga.controller;

import com.example.alabuga.dto.StatisticsDTO;
import com.example.alabuga.dto.MissionStatisticsDTO;
import com.example.alabuga.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@Tag(name = "Statistics", description = "API для получения статистики системы")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/overview")
    @Operation(summary = "Получить общую статистику системы")
    public ResponseEntity<StatisticsDTO> getOverviewStatistics() {
        StatisticsDTO statistics = statisticsService.getOverviewStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/activity-chart")
    @Operation(summary = "Получить данные для графика активности пользователей")
    public ResponseEntity<Object> getActivityChart() {
        Object chartData = statisticsService.getActivityChartData();
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/missions/{missionId}")
    @Operation(summary = "Получить статистику по конкретной миссии")
    public ResponseEntity<MissionStatisticsDTO> getMissionStatistics(@PathVariable("missionId") Long missionId) {
        MissionStatisticsDTO stats = statisticsService.getMissionStatistics(missionId);
        return ResponseEntity.ok(stats);
    }
}
