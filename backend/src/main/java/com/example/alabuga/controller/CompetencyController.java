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

import com.example.alabuga.entity.Competency;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.repository.CompetencyRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/competencies")
@Tag(name = "Competency Management", description = "API для управления компетенциями")
@RequiredArgsConstructor
public class CompetencyController {

    private final CompetencyRepository competencyRepository;
    
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
    
}
