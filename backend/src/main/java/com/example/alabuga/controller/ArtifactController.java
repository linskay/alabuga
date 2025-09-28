package com.example.alabuga.controller;

import com.example.alabuga.dto.ArtifactCreateDTO;
import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.ArtifactUpdateDTO;
import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.service.ArtifactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artifacts")
@Tag(name = "Artifact Management", description = "API для управления артефактами")
@RequiredArgsConstructor
public class ArtifactController {

    private final ArtifactService artifactService;

    @GetMapping
    @Operation(summary = "Получить все артефакты")
    public ResponseEntity<List<ArtifactDTO>> getAllArtifacts() {
        List<ArtifactDTO> artifacts = artifactService.getAllArtifacts();
        return ResponseEntity.ok(artifacts);
    }

    @GetMapping("/active")
    @Operation(summary = "Получить только активные артефакты")
    public ResponseEntity<List<ArtifactDTO>> getActiveArtifacts() {
        List<ArtifactDTO> artifacts = artifactService.getActiveArtifacts();
        return ResponseEntity.ok(artifacts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить артефакт по ID")
    public ResponseEntity<ArtifactDTO> getArtifactById(
            @Parameter(description = "ID артефакта") @PathVariable Long id) {
        ArtifactDTO artifact = artifactService.getArtifactById(id);
        return ResponseEntity.ok(artifact);
    }

    @GetMapping("/rarity/{rarity}")
    @Operation(summary = "Получить артефакты по редкости")
    public ResponseEntity<List<ArtifactDTO>> getArtifactsByRarity(
            @Parameter(description = "Редкость артефакта") @PathVariable String rarity) {
        List<ArtifactDTO> artifacts = artifactService.getArtifactsByRarity(rarity);
        return ResponseEntity.ok(artifacts);
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск артефактов по названию")
    public ResponseEntity<List<ArtifactDTO>> searchArtifactsByName(
            @Parameter(description = "Название для поиска") @RequestParam String name) {
        List<ArtifactDTO> artifacts = artifactService.searchArtifactsByName(name);
        return ResponseEntity.ok(artifacts);
    }

    @PostMapping
    @Operation(summary = "Создать артефакт")
    public ResponseEntity<ArtifactDTO> createArtifact(@RequestBody ArtifactCreateDTO artifactCreateDTO) {
        ArtifactDTO artifact = artifactService.createArtifact(artifactCreateDTO);
        return ResponseEntity.ok(artifact);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить артефакт")
    public ResponseEntity<ArtifactDTO> updateArtifact(
            @Parameter(description = "ID артефакта") @PathVariable Long id,
            @RequestBody ArtifactUpdateDTO artifactUpdateDTO) {
        ArtifactDTO artifact = artifactService.updateArtifact(id, artifactUpdateDTO);
        return ResponseEntity.ok(artifact);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить артефакт")
    public ResponseEntity<Void> deleteArtifact(
            @Parameter(description = "ID артефакта") @PathVariable Long id) {
        artifactService.deleteArtifact(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/toggle-status")
    @Operation(summary = "Переключить статус артефакта")
    public ResponseEntity<ArtifactDTO> toggleArtifactStatus(
            @Parameter(description = "ID артефакта") @PathVariable Long id) {
        ArtifactDTO artifact = artifactService.toggleArtifactStatus(id);
        return ResponseEntity.ok(artifact);
    }

    // ========== USER ARTIFACT MANAGEMENT ==========

    @GetMapping("/user/{userId}")
    @Operation(summary = "Получить артефакты пользователя")
    public ResponseEntity<List<UserArtifactDTO>> getUserArtifacts(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        List<UserArtifactDTO> userArtifacts = artifactService.getUserArtifacts(userId);
        return ResponseEntity.ok(userArtifacts);
    }

    @GetMapping("/user/{userId}/public")
    @Operation(summary = "Получить артефакты другого пользователя (публичный просмотр)")
    public ResponseEntity<List<UserArtifactDTO>> getOtherUserArtifacts(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        List<UserArtifactDTO> userArtifacts = artifactService.getOtherUserArtifacts(userId);
        return ResponseEntity.ok(userArtifacts);
    }

    @PostMapping("/assign")
    @Operation(summary = "Назначить артефакт пользователю")
    public ResponseEntity<UserArtifactDTO> assignArtifactToUser(
            @Parameter(description = "ID пользователя") @RequestParam Long userId,
            @Parameter(description = "ID артефакта") @RequestParam Long artifactId) {
        UserArtifactDTO userArtifact = artifactService.assignArtifactToUser(userId, artifactId);
        return ResponseEntity.ok(userArtifact);
    }

    @DeleteMapping("/user/{userId}/artifact/{artifactId}")
    @Operation(summary = "Удалить артефакт у пользователя")
    public ResponseEntity<Void> removeArtifactFromUser(
            @Parameter(description = "ID пользователя") @PathVariable Long userId,
            @Parameter(description = "ID артефакта") @PathVariable Long artifactId) {
        artifactService.removeArtifactFromUser(userId, artifactId);
        return ResponseEntity.ok().build();
    }

}
