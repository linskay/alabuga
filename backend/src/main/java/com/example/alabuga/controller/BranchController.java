package com.example.alabuga.controller;

import com.example.alabuga.dto.BranchDTO;
import com.example.alabuga.entity.MissionBranch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@Tag(name = "Branch Management", description = "API для управления ветками миссий")
public class BranchController {

    @GetMapping
    @Operation(summary = "Получить все ветки миссий")
    public ResponseEntity<List<BranchDTO>> getAllBranches() {
        List<BranchDTO> branches = List.of(MissionBranch.values())
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(branches);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить ветку по ID")
    public ResponseEntity<BranchDTO> getBranchById(
            @Parameter(description = "ID ветки") @PathVariable Long id) {
        MissionBranch branch = MissionBranch.fromId(id);
        BranchDTO branchDTO = toDTO(branch);
        return ResponseEntity.ok(branchDTO);
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск веток по названию")
    public ResponseEntity<List<BranchDTO>> searchBranches(
            @Parameter(description = "Название для поиска") @RequestParam String name) {
        List<BranchDTO> branches = List.of(MissionBranch.values())
                .stream()
                .filter(branch -> branch.getName().toLowerCase().contains(name.toLowerCase()))
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(branches);
    }

    private BranchDTO toDTO(MissionBranch branch) {
        return BranchDTO.builder()
                .id(branch.getId())
                .name(branch.getName())
                .shortDescription(branch.getShortDescription())
                .description(branch.getDescription())
                .build();
    }
}