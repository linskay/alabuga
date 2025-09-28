package com.example.alabuga.controller;

import com.example.alabuga.entity.Competency;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.repository.CompetencyRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/competencies")
@Tag(name = "Competency Management", description = "API для управления компетенциями")
@RequiredArgsConstructor
public class CompetencyController {

    private final CompetencyRepository competencyRepository;

    @GetMapping
    @Operation(summary = "Получить все компетенции")
    public ResponseEntity<List<Competency>> getAllCompetencies() {
        List<Competency> competencies = competencyRepository.findByIsActive(true);
        return ResponseEntity.ok(competencies);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить компетенцию по ID")
    public ResponseEntity<Competency> getCompetencyById(
            @Parameter(description = "ID компетенции") @PathVariable Long id) {
        Competency competency = competencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компетенция", id));
        return ResponseEntity.ok(competency);
    }

    @PostMapping
    @Operation(summary = "Создать новую компетенцию")
    public ResponseEntity<Competency> createCompetency(@RequestBody Competency competency) {
        Competency savedCompetency = competencyRepository.save(competency);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCompetency);
    }

    @PutMapping("/{id}")
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

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить компетенцию")
    public ResponseEntity<Void> deleteCompetency(
            @Parameter(description = "ID компетенции") @PathVariable Long id) {
        Competency competency = competencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компетенция", id));

        competencyRepository.delete(competency);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск компетенций по названию")
    public ResponseEntity<List<Competency>> searchCompetencies(
            @Parameter(description = "Название для поиска") @RequestParam String name) {
        List<Competency> competencies = competencyRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(competencies);
    }

}
