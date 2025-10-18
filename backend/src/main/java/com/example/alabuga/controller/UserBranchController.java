package com.example.alabuga.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.alabuga.dto.UserDTO;
import com.example.alabuga.entity.Rank;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.service.user.UserBranchService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Branch Management", description = "API для управления ветками развития пользователей")
public class UserBranchController {

    private final UserBranchService userBranchService;

    public UserBranchController(UserBranchService userBranchService) {
        this.userBranchService = userBranchService;
    }

    @GetMapping("/{userId}/branches/available")
    @Operation(summary = "Получить доступные ветки для выбора")
    public ResponseEntity<List<Rank.RankBranch>> getAvailableBranches(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        List<Rank.RankBranch> branches = userBranchService.getAvailableBranches(userId);
        return ResponseEntity.ok(branches);
    }

    @GetMapping("/{userId}/branches/current")
    @Operation(summary = "Получить текущую ветку пользователя")
    public ResponseEntity<Rank.RankBranch> getCurrentBranch(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        Rank.RankBranch branch = userBranchService.getCurrentBranch(userId);
        return ResponseEntity.ok(branch);
    }

    @PostMapping("/{userId}/branches/select")
    @Operation(summary = "Выбрать ветку развития")
    public ResponseEntity<UserDTO> selectBranch(
            @Parameter(description = "ID пользователя") @PathVariable Long userId,
            @RequestBody BranchSelectionRequest request) {
        try {
            // Преобразуем строку в enum
            Rank.RankBranch branch = Rank.RankBranch.valueOf(request.getBranch());
            UserDTO user = userBranchService.selectBranch(userId, branch);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            throw new BusinessLogicException("Неверная ветка развития: " + request.getBranch());
        }
    }

    @GetMapping("/{userId}/branches/next-rank")
    @Operation(summary = "Получить следующий ранг для пользователя")
    public ResponseEntity<Rank> getNextRank(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        Rank nextRank = userBranchService.getNextRank(userId);
        return ResponseEntity.ok(nextRank);
    }

    @GetMapping("/{userId}/branches/can-promote")
    @Operation(summary = "Проверить, может ли пользователь повысить ранг")
    public ResponseEntity<Boolean> canPromoteRank(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        boolean canPromote = userBranchService.canPromoteRank(userId);
        return ResponseEntity.ok(canPromote);
    }

    // ========== DTO CLASSES ==========

    public static class BranchSelectionRequest {
        private String branch;

        public String getBranch() {
            return branch;
        }

        public void setBranch(String branch) {
            this.branch = branch;
        }
    }
}
