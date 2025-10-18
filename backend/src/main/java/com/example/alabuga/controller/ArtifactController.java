package com.example.alabuga.controller;

import com.example.alabuga.dto.ArtifactCreateDTO;
import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.ArtifactUpdateDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.service.ArtifactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import com.example.alabuga.security.AdminGuard;
import jakarta.validation.constraints.Positive;
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
            @Parameter(description = "ID артефакта", required = true)
            @PathVariable
            @Positive(message = "ID артефакта должен быть положительным")
            Long id) {
        ArtifactDTO artifact = artifactService.getArtifactById(id);
        return ResponseEntity.ok(artifact);
    }

    @GetMapping("/rarity/{rarity}")
    @Operation(summary = "Получить артефакты по редкости")
    public ResponseEntity<List<ArtifactDTO>> getArtifactsByRarity(
            @Parameter(description = "Редкость артефакта", required = true, schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = Artifact.ArtifactRarity.class))
            @PathVariable
            Artifact.ArtifactRarity rarity) {
        List<ArtifactDTO> artifacts = artifactService.getArtifactsByRarity(String.valueOf(rarity));
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
    public ResponseEntity<ArtifactDTO> createArtifact(
            HttpServletRequest request,
            @Valid @RequestBody ArtifactCreateDTO artifactCreateDTO) {
        AdminGuard.assertAdmin(request);
        ArtifactDTO artifact = artifactService.createArtifact(artifactCreateDTO);
        return ResponseEntity.ok(artifact);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить артефакт")
    public ResponseEntity<ArtifactDTO> updateArtifact(
            HttpServletRequest request,
            @Parameter(description = "ID артефакта") @PathVariable Long id,
            @RequestBody ArtifactUpdateDTO artifactUpdateDTO) {
        AdminGuard.assertAdmin(request);
        ArtifactDTO artifact = artifactService.updateArtifact(id, artifactUpdateDTO);
        return ResponseEntity.ok(artifact);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить артефакт")
    public ResponseEntity<Void> deleteArtifact(
            HttpServletRequest request,
            @Parameter(description = "ID артефакта") @PathVariable Long id) {
        AdminGuard.assertAdmin(request);
        artifactService.deleteArtifact(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/toggle-status")
    @Operation(summary = "Переключить статус артефакта")
    public ResponseEntity<ArtifactDTO> toggleArtifactStatus(
            HttpServletRequest request,
            @Parameter(description = "ID артефакта") @PathVariable Long id) {
        AdminGuard.assertAdmin(request);
        ArtifactDTO artifact = artifactService.toggleArtifactStatus(id);
        return ResponseEntity.ok(artifact);
    }


}
