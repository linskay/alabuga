package com.example.alabuga.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.CompetencyDTO;
import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.dto.UserCompetencyDTO;
import com.example.alabuga.dto.UserCreateDTO;
import com.example.alabuga.dto.UserDTO;
import com.example.alabuga.dto.UserUpdateDTO;
import com.example.alabuga.entity.UserRole;
import com.example.alabuga.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "API для управления пользователями")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    // ========== USER CRUD ENDPOINTS ==========
    
    @GetMapping
    @Operation(summary = "Получить всех пользователей")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Получить пользователя по ID")
    public ResponseEntity<UserDTO> getUserById(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        Optional<UserDTO> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/login/{login}")
    @Operation(summary = "Получить пользователя по логину")
    public ResponseEntity<UserDTO> getUserByLogin(
            @Parameter(description = "Логин пользователя") @PathVariable String login) {
        Optional<UserDTO> user = userService.getUserByLogin(login);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    @Operation(summary = "Получить пользователя по email")
    public ResponseEntity<UserDTO> getUserByEmail(
            @Parameter(description = "Email пользователя") @PathVariable String email) {
        Optional<UserDTO> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Создать нового пользователя")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        UserDTO savedUser = userService.createUser(userCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Обновить пользователя")
    public ResponseEntity<UserDTO> updateUser(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        UserDTO updatedUser = userService.updateUser(id, userUpdateDTO);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить пользователя")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Деактивировать пользователя")
    public ResponseEntity<UserDTO> deactivateUser(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        UserDTO user = userService.deactivateUser(id);
        return ResponseEntity.ok(user);
    }
    
    // ========== SEARCH ENDPOINTS ==========
    
    @GetMapping("/search")
    @Operation(summary = "Поиск пользователей по имени")
    public ResponseEntity<List<UserDTO>> searchUsersByName(
            @Parameter(description = "Имя для поиска") @RequestParam String name) {
        List<UserDTO> users = userService.searchUsersByName(name);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/role/{role}")
    @Operation(summary = "Получить пользователей по роли")
    public ResponseEntity<List<UserDTO>> getUsersByRole(
            @Parameter(description = "Роль пользователя") @PathVariable UserRole role) {
        List<UserDTO> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/active")
    @Operation(summary = "Получить активных пользователей")
    public ResponseEntity<List<UserDTO>> getActiveUsers() {
        List<UserDTO> users = userService.getActiveUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/rank/{minRank}")
    @Operation(summary = "Получить пользователей с минимальным рангом")
    public ResponseEntity<List<UserDTO>> getUsersByMinRank(
            @Parameter(description = "Минимальный ранг") @PathVariable Integer minRank) {
        List<UserDTO> users = userService.getUsersByMinRank(minRank);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/experience/{minExperience}")
    @Operation(summary = "Получить пользователей с минимальным опытом")
    public ResponseEntity<List<UserDTO>> getUsersByMinExperience(
            @Parameter(description = "Минимальный опыт") @PathVariable Integer minExperience) {
        List<UserDTO> users = userService.getUsersByMinExperience(minExperience);
        return ResponseEntity.ok(users);
    }
    
    // ========== USER STATS ENDPOINTS ==========
    
    @PostMapping("/{id}/experience")
    @Operation(summary = "Добавить опыт пользователю")
    public ResponseEntity<UserDTO> addExperience(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "Количество опыта") @RequestParam Integer experience) {
        UserDTO user = userService.addExperience(id, experience);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/{id}/mana")
    @Operation(summary = "Добавить ману пользователю")
    public ResponseEntity<UserDTO> addMana(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "Количество маны") @RequestParam Integer mana) {
        UserDTO user = userService.addMana(id, mana);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/{id}/mana/spend")
    @Operation(summary = "Потратить ману пользователя")
    public ResponseEntity<UserDTO> spendMana(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "Количество маны для траты") @RequestParam Integer mana) {
        UserDTO user = userService.spendMana(id, mana);
        return ResponseEntity.ok(user);
    }
    
    // ========== COMPETENCY ENDPOINTS ==========
    
    @GetMapping("/competencies")
    @Operation(summary = "Получить все компетенции")
    public ResponseEntity<List<CompetencyDTO>> getAllCompetencies() {
        List<CompetencyDTO> competencies = userService.getAllCompetencies();
        return ResponseEntity.ok(competencies);
    }
    
    @GetMapping("/{id}/competencies")
    @Operation(summary = "Получить компетенции пользователя")
    public ResponseEntity<List<UserCompetencyDTO>> getUserCompetencies(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        List<UserCompetencyDTO> competencies = userService.getUserCompetencies(id);
        return ResponseEntity.ok(competencies);
    }
    
    @PostMapping("/{id}/competencies")
    @Operation(summary = "Добавить компетенцию пользователю")
    public ResponseEntity<UserCompetencyDTO> addUserCompetency(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID компетенции") @RequestParam Long competencyId,
            @Parameter(description = "Начальный уровень") @RequestParam(required = false) Integer initialLevel) {
        UserCompetencyDTO userCompetency = userService.addUserCompetency(id, competencyId, initialLevel);
        return ResponseEntity.status(HttpStatus.CREATED).body(userCompetency);
    }
    
    @PutMapping("/{id}/competencies/{competencyId}")
    @Operation(summary = "Обновить очки опыта компетенции пользователя")
    public ResponseEntity<UserCompetencyDTO> updateCompetencyExperience(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID компетенции") @PathVariable Long competencyId,
            @Parameter(description = "Очки опыта (максимум 500)") @RequestParam Integer experiencePoints) {
        UserCompetencyDTO userCompetency = userService.updateCompetencyExperience(id, competencyId, experiencePoints);
        return ResponseEntity.ok(userCompetency);
    }
    
    // ========== ARTIFACT ENDPOINTS ==========
    
    @GetMapping("/artifacts")
    @Operation(summary = "Получить все артефакты")
    public ResponseEntity<List<ArtifactDTO>> getAllArtifacts() {
        List<ArtifactDTO> artifacts = userService.getAllArtifacts();
        return ResponseEntity.ok(artifacts);
    }
    
    @GetMapping("/{id}/artifacts")
    @Operation(summary = "Получить артефакты пользователя")
    public ResponseEntity<List<UserArtifactDTO>> getUserArtifacts(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        List<UserArtifactDTO> artifacts = userService.getUserArtifacts(id);
        return ResponseEntity.ok(artifacts);
    }
    
    @PostMapping("/{id}/artifacts")
    @Operation(summary = "Добавить артефакт пользователю")
    public ResponseEntity<UserArtifactDTO> addUserArtifact(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID артефакта") @RequestParam Long artifactId) {
        UserArtifactDTO userArtifact = userService.addUserArtifact(id, artifactId);
        return ResponseEntity.status(HttpStatus.CREATED).body(userArtifact);
    }
    
    @PostMapping("/{id}/artifacts/{artifactId}/equip")
    @Operation(summary = "Экипировать артефакт")
    public ResponseEntity<UserArtifactDTO> equipArtifact(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID артефакта") @PathVariable Long artifactId) {
        UserArtifactDTO userArtifact = userService.equipArtifact(id, artifactId);
        return ResponseEntity.ok(userArtifact);
    }
    
    @PostMapping("/{id}/artifacts/{artifactId}/unequip")
    @Operation(summary = "Снять артефакт")
    public ResponseEntity<UserArtifactDTO> unequipArtifact(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID артефакта") @PathVariable Long artifactId) {
        UserArtifactDTO userArtifact = userService.unequipArtifact(id, artifactId);
        return ResponseEntity.ok(userArtifact);
    }
    
    // ========== COMPETENCY TRACKING ENDPOINTS ==========
    
    @PostMapping("/{id}/competencies/{competencyId}/experience")
    @Operation(summary = "Добавить опыт к компетенции")
    public ResponseEntity<UserCompetencyDTO> addExperienceToCompetency(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID компетенции") @PathVariable Long competencyId,
            @Parameter(description = "Количество очков опыта") @RequestParam Integer experiencePoints) {
        UserCompetencyDTO userCompetency = userService.addExperienceToCompetency(id, competencyId, experiencePoints);
        return ResponseEntity.ok(userCompetency);
    }
}