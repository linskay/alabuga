package com.example.alabuga.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.alabuga.dto.MissionCreateDTO;
import com.example.alabuga.dto.MissionDTO;
import com.example.alabuga.dto.MissionUpdateDTO;
import com.example.alabuga.dto.UserMissionDTO;
import com.example.alabuga.service.MissionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/missions")
@Tag(name = "Mission Management", description = "API для управления миссиями")
@RequiredArgsConstructor
public class MissionController {

    private final MissionService missionService;

    @GetMapping
    @Operation(summary = "Получить все активные миссии")
    public ResponseEntity<List<MissionDTO>> getAllMissions() {
        List<MissionDTO> missions = missionService.getAllMissions();
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Получить миссии по ветке")
    public ResponseEntity<List<MissionDTO>> getMissionsByBranch(
            @Parameter(description = "ID ветки") @PathVariable Long branchId) {
        List<MissionDTO> missions = missionService.getMissionsByBranch(branchId);
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить миссию по ID")
    public ResponseEntity<MissionDTO> getMissionById(
            @Parameter(description = "ID миссии") @PathVariable Long id) {
        MissionDTO mission = missionService.getMissionById(id);
        return ResponseEntity.ok(mission);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Получить миссии пользователя")
    public ResponseEntity<List<UserMissionDTO>> getUserMissions(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        List<UserMissionDTO> userMissions = missionService.getUserMissions(userId);
        return ResponseEntity.ok(userMissions);
    }

    @GetMapping("/user/{userId}/branch/{branchId}")
    @Operation(summary = "Получить миссии пользователя по ветке")
    public ResponseEntity<List<UserMissionDTO>> getUserMissionsByBranch(
            @Parameter(description = "ID пользователя") @PathVariable Long userId,
            @Parameter(description = "ID ветки") @PathVariable Long branchId) {
        List<UserMissionDTO> userMissions = missionService.getUserMissionsByBranch(userId, branchId);
        return ResponseEntity.ok(userMissions);
    }

    @PostMapping("/start")
    @Operation(summary = "Начать миссию")
    public ResponseEntity<UserMissionDTO> startMission(
            @Parameter(description = "ID пользователя") @RequestParam Long userId,
            @Parameter(description = "ID миссии") @RequestParam Long missionId) {
        UserMissionDTO userMission = missionService.startMission(userId, missionId);
        return ResponseEntity.ok(userMission);
    }

    @PutMapping("/progress")
    @Operation(summary = "Обновить прогресс миссии")
    public ResponseEntity<UserMissionDTO> updateMissionProgress(
            @Parameter(description = "ID пользователя") @RequestParam Long userId,
            @Parameter(description = "ID миссии") @RequestParam Long missionId,
            @Parameter(description = "Прогресс (0-100)") @RequestParam Integer progress,
            @Parameter(description = "Заметки") @RequestParam(required = false) String notes) {
        UserMissionDTO userMission = missionService.updateMissionProgress(userId, missionId, progress, notes);
        return ResponseEntity.ok(userMission);
    }

    @PostMapping("/complete")
    @Operation(summary = "Завершить миссию")
    public ResponseEntity<UserMissionDTO> completeMission(
            @Parameter(description = "ID пользователя") @RequestParam Long userId,
            @Parameter(description = "ID миссии") @RequestParam Long missionId) {
        UserMissionDTO userMission = missionService.completeMission(userId, missionId);
        return ResponseEntity.ok(userMission);
    }

    @PostMapping
    @Operation(summary = "Создать миссию")
    public ResponseEntity<MissionDTO> createMission(@RequestBody MissionCreateDTO missionCreateDTO) {
        MissionDTO mission = missionService.createMission(missionCreateDTO);
        return ResponseEntity.ok(mission);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить миссию")
    public ResponseEntity<MissionDTO> updateMission(
            @Parameter(description = "ID миссии") @PathVariable Long id,
            @RequestBody MissionUpdateDTO missionUpdateDTO) {
        MissionDTO mission = missionService.updateMission(id, missionUpdateDTO);
        return ResponseEntity.ok(mission);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить миссию")
    public ResponseEntity<Void> deleteMission(
            @Parameter(description = "ID миссии") @PathVariable Long id) {
        missionService.deleteMission(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/moderate")
    @Operation(summary = "Модерировать миссию")
    public ResponseEntity<UserMissionDTO> moderateMission(
            @Parameter(description = "ID пользователя") @RequestParam Long userId,
            @Parameter(description = "ID миссии") @RequestParam Long missionId,
            @Parameter(description = "Одобрено ли") @RequestParam Boolean approved) {
        UserMissionDTO userMission = missionService.moderateMission(userId, missionId, approved);
        return ResponseEntity.ok(userMission);
    }
}
