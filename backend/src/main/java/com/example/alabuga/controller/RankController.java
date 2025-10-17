package com.example.alabuga.controller;

import com.example.alabuga.dto.*;
import com.example.alabuga.entity.Rank.RankBranch;
import com.example.alabuga.mapper.UserMapper;
import com.example.alabuga.service.RankService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranks")
@Tag(name = "Rank Management", description = "API для управления рангами и требованиями")
@RequiredArgsConstructor
public class RankController {

    private final RankService rankService;
    private final UserMapper userMapper;

    // ========== RANK ENDPOINTS ==========

    @GetMapping
    @Operation(summary = "Получить все ранги")
    public ResponseEntity<List<RankDTO>> getAllRanks() {
        List<RankDTO> ranks = rankService.getAllRanks();
        return ResponseEntity.ok(ranks);
    }

    @GetMapping("/branch/{branch}")
    @Operation(summary = "Получить ранги по ветке")
    public ResponseEntity<List<RankDTO>> getRanksByBranch(
            @Parameter(description = "Ветка развития") @PathVariable RankBranch branch) {
        List<RankDTO> ranks = rankService.getRanksByBranch(branch);
        return ResponseEntity.ok(ranks);
    }

    @GetMapping("/level/{level}")
    @Operation(summary = "Получить ранг по уровню")
    public ResponseEntity<RankDTO> getRankByLevel(
            @Parameter(description = "Уровень ранга") @PathVariable Integer level) {
        RankDTO rank = rankService.getRankByLevel(level);
        return ResponseEntity.ok(rank);
    }

    // ========== RANK REQUIREMENTS ENDPOINTS ==========

    @GetMapping("/requirements")
    @Operation(summary = "Получить все требования рангов")
    public ResponseEntity<List<RankRequirementsDTO>> getAllRankRequirements() {
        List<RankRequirementsDTO> requirements = rankService.getAllRankRequirements();
        return ResponseEntity.ok(requirements);
    }

    @GetMapping("/requirements/active")
    @Operation(summary = "Получить активные требования рангов")
    public ResponseEntity<List<RankRequirementsDTO>> getActiveRankRequirements() {
        List<RankRequirementsDTO> requirements = rankService.getActiveRankRequirements();
        return ResponseEntity.ok(requirements);
    }

    @GetMapping("/requirements/level/{level}")
    @Operation(summary = "Получить требования ранга по уровню")
    public ResponseEntity<RankRequirementsDTO> getRankRequirementsByLevel(
            @Parameter(description = "Уровень ранга") @PathVariable Integer level) {
        RankRequirementsDTO requirements = rankService.getRankRequirementsByLevel(level);
        return ResponseEntity.ok(requirements);
    }

    @PostMapping("/requirements")
    @Operation(summary = "Создать требования ранга")
    public ResponseEntity<RankRequirementsDTO> createRankRequirements(@RequestBody RankRequirementsCreateDTO dto) {
        RankRequirementsDTO requirements = rankService.createRankRequirements(dto);
        return ResponseEntity.ok(requirements);
    }

    @PutMapping("/requirements/{id}")
    @Operation(summary = "Обновить требования ранга")
    public ResponseEntity<RankRequirementsDTO> updateRankRequirements(
            @Parameter(description = "ID требований") @PathVariable Long id,
            @RequestBody RankRequirementsUpdateDTO dto) {
        RankRequirementsDTO requirements = rankService.updateRankRequirements(id, dto);
        return ResponseEntity.ok(requirements);
    }

    @DeleteMapping("/requirements/{id}")
    @Operation(summary = "Удалить требования ранга")
    public ResponseEntity<Void> deleteRankRequirements(
            @Parameter(description = "ID требований") @PathVariable Long id) {
        rankService.deleteRankRequirements(id);
        return ResponseEntity.ok().build();
    }

    // ========== RANK PROMOTION ENDPOINTS ==========

    @PostMapping("/promote")
    @Operation(summary = "Повысить пользователя до следующего ранга")
    public ResponseEntity<UserDTO> promoteUserToNextRank(
            @Parameter(description = "ID пользователя") @RequestParam Long userId) {
        var user = rankService.promoteUserToNextRank(userId);
        UserDTO userDTO = userMapper.toDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/can-promote")
    @Operation(summary = "Проверить, может ли пользователь быть повышен")
    public ResponseEntity<Boolean> checkUserCanBePromoted(
            @Parameter(description = "ID пользователя") @RequestParam Long userId) {
        boolean canPromote = rankService.checkUserCanBePromoted(userId);
        return ResponseEntity.ok(canPromote);
    }
}
