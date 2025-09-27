package com.example.alabuga.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.service.UserArtifactService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Artifacts Management", description = "API для управления артефактами пользователей")
@RequiredArgsConstructor
public class UserArtifactController {
    
    private final UserArtifactService userArtifactService;
    
    @GetMapping("/{userId}/artifacts")
    @Operation(summary = "Получить артефакты пользователя")
    public ResponseEntity<List<UserArtifactDTO>> getUserArtifacts(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        List<UserArtifactDTO> artifacts = userArtifactService.getUserArtifacts(userId);
        return ResponseEntity.ok(artifacts);
    }
    
    @PostMapping("/{userId}/artifacts/{artifactId}/equip")
    @Operation(summary = "Экипировать/снять артефакт")
    public ResponseEntity<UserArtifactDTO> equipArtifact(
            @Parameter(description = "ID пользователя") @PathVariable Long userId,
            @Parameter(description = "ID артефакта") @PathVariable Long artifactId) {
        UserArtifactDTO artifact = userArtifactService.equipArtifact(userId, artifactId);
        return ResponseEntity.ok(artifact);
    }
    
    @PostMapping("/{userId}/artifacts/{artifactId}/give")
    @Operation(summary = "Выдать артефакт пользователю (только для админов)")
    public ResponseEntity<UserArtifactDTO> giveArtifactToUser(
            @Parameter(description = "ID пользователя") @PathVariable Long userId,
            @Parameter(description = "ID артефакта") @PathVariable Long artifactId) {
        UserArtifactDTO artifact = userArtifactService.giveArtifactToUser(userId, artifactId);
        return ResponseEntity.ok(artifact);
    }
}
