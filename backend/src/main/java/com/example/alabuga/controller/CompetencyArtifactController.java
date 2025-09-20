package com.example.alabuga.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.Competency;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.repository.ArtifactRepository;
import com.example.alabuga.repository.CompetencyRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@Tag(name = "Competency & Artifact Management", description = "API для управления компетенциями и артефактами")
@RequiredArgsConstructor
public class CompetencyArtifactController {

    private final CompetencyRepository competencyRepository;
    private final ArtifactRepository artifactRepository;
    
    // ========== COMPETENCY MANAGEMENT ==========
    
    @GetMapping("/competencies")
    @Operation(summary = "Получить все компетенции")
    public ResponseEntity<List<Competency>> getAllCompetencies() {
        List<Competency> competencies = competencyRepository.findByIsActive(true);
        return ResponseEntity.ok(competencies);
    }
    
    @GetMapping("/competencies/{id}")
    @Operation(summary = "Получить компетенцию по ID")
    public ResponseEntity<Competency> getCompetencyById(
            @Parameter(description = "ID компетенции") @PathVariable Long id) {
        Competency competency = competencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компетенция", id));
        return ResponseEntity.ok(competency);
    }
    
    @PostMapping("/competencies")
    @Operation(summary = "Создать новую компетенцию")
    public ResponseEntity<Competency> createCompetency(@RequestBody Competency competency) {
        Competency savedCompetency = competencyRepository.save(competency);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCompetency);
    }
    
    @PutMapping("/competencies/{id}")
    @Operation(summary = "Обновить компетенцию")
    public ResponseEntity<Competency> updateCompetency(
            @Parameter(description = "ID компетенции") @PathVariable Long id,
            @RequestBody Competency competencyDetails) {
        Competency existingCompetency = competencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компетенция", id));
        
        existingCompetency.setName(competencyDetails.getName());
        existingCompetency.setShortDescription(competencyDetails.getShortDescription());
        existingCompetency.setDescription(competencyDetails.getDescription());
        existingCompetency.setIsActive(competencyDetails.getIsActive());
        
        Competency updatedCompetency = competencyRepository.save(existingCompetency);
        return ResponseEntity.ok(updatedCompetency);
    }
    
    @DeleteMapping("/competencies/{id}")
    @Operation(summary = "Удалить компетенцию")
    public ResponseEntity<Void> deleteCompetency(
            @Parameter(description = "ID компетенции") @PathVariable Long id) {
        Competency competency = competencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компетенция", id));
        
        competencyRepository.delete(competency);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/competencies/search")
    @Operation(summary = "Поиск компетенций по названию")
    public ResponseEntity<List<Competency>> searchCompetencies(
            @Parameter(description = "Название для поиска") @RequestParam String name) {
        List<Competency> competencies = competencyRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(competencies);
    }
    
    // ========== ARTIFACT MANAGEMENT ==========
    
    @GetMapping("/artifacts")
    @Operation(summary = "Получить все артефакты")
    public ResponseEntity<List<Artifact>> getAllArtifacts() {
        List<Artifact> artifacts = artifactRepository.findByIsActive(true);
        return ResponseEntity.ok(artifacts);
    }
    
    @GetMapping("/artifacts/{id}")
    @Operation(summary = "Получить артефакт по ID")
    public ResponseEntity<Artifact> getArtifactById(
            @Parameter(description = "ID артефакта") @PathVariable Long id) {
        Artifact artifact = artifactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", id));
        return ResponseEntity.ok(artifact);
    }
    
    @PostMapping("/artifacts")
    @Operation(summary = "Создать новый артефакт")
    public ResponseEntity<Artifact> createArtifact(@RequestBody Artifact artifact) {
        Artifact savedArtifact = artifactRepository.save(artifact);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedArtifact);
    }
    
    @PutMapping("/artifacts/{id}")
    @Operation(summary = "Обновить артефакт")
    public ResponseEntity<Artifact> updateArtifact(
            @Parameter(description = "ID артефакта") @PathVariable Long id,
            @RequestBody Artifact artifactDetails) {
        Artifact existingArtifact = artifactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", id));
        
        existingArtifact.setName(artifactDetails.getName());
        existingArtifact.setDescription(artifactDetails.getDescription());
        existingArtifact.setRarity(artifactDetails.getRarity());
        existingArtifact.setPowerLevel(artifactDetails.getPowerLevel());
        existingArtifact.setIsActive(artifactDetails.getIsActive());
        
        Artifact updatedArtifact = artifactRepository.save(existingArtifact);
        return ResponseEntity.ok(updatedArtifact);
    }
    
    @DeleteMapping("/artifacts/{id}")
    @Operation(summary = "Удалить артефакт")
    public ResponseEntity<Void> deleteArtifact(
            @Parameter(description = "ID артефакта") @PathVariable Long id) {
        Artifact artifact = artifactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", id));
        
        artifactRepository.delete(artifact);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/artifacts/rarity/{rarity}")
    @Operation(summary = "Получить артефакты по редкости")
    public ResponseEntity<List<Artifact>> getArtifactsByRarity(
            @Parameter(description = "Редкость артефакта") @PathVariable Artifact.ArtifactRarity rarity) {
        List<Artifact> artifacts = artifactRepository.findByRarity(rarity);
        return ResponseEntity.ok(artifacts);
    }
    
    @GetMapping("/artifacts/search")
    @Operation(summary = "Поиск артефактов по названию")
    public ResponseEntity<List<Artifact>> searchArtifacts(
            @Parameter(description = "Название для поиска") @RequestParam String name) {
        List<Artifact> artifacts = artifactRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(artifacts);
    }
}
