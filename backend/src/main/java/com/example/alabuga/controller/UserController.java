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

import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.Competency;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserArtifact;
import com.example.alabuga.entity.UserCompetency;
import com.example.alabuga.entity.UserRole;
import com.example.alabuga.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Получить пользователя по ID")
    public ResponseEntity<User> getUserById(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/login/{login}")
    @Operation(summary = "Получить пользователя по логину")
    public ResponseEntity<User> getUserByLogin(
            @Parameter(description = "Логин пользователя") @PathVariable String login) {
        Optional<User> user = userService.getUserByLogin(login);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    @Operation(summary = "Получить пользователя по email")
    public ResponseEntity<User> getUserByEmail(
            @Parameter(description = "Email пользователя") @PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Создать нового пользователя")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User savedUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Обновить пользователя")
    public ResponseEntity<User> updateUser(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить пользователя")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Деактивировать пользователя")
    public ResponseEntity<User> deactivateUser(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        try {
            User user = userService.deactivateUser(id);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // ========== SEARCH ENDPOINTS ==========
    
    @GetMapping("/search")
    @Operation(summary = "Поиск пользователей по имени")
    public ResponseEntity<List<User>> searchUsersByName(
            @Parameter(description = "Имя для поиска") @RequestParam String name) {
        List<User> users = userService.searchUsersByName(name);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/role/{role}")
    @Operation(summary = "Получить пользователей по роли")
    public ResponseEntity<List<User>> getUsersByRole(
            @Parameter(description = "Роль пользователя") @PathVariable UserRole role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/active")
    @Operation(summary = "Получить активных пользователей")
    public ResponseEntity<List<User>> getActiveUsers() {
        List<User> users = userService.getActiveUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/rank/{minRank}")
    @Operation(summary = "Получить пользователей с минимальным рангом")
    public ResponseEntity<List<User>> getUsersByMinRank(
            @Parameter(description = "Минимальный ранг") @PathVariable Integer minRank) {
        List<User> users = userService.getUsersByMinRank(minRank);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/experience/{minExperience}")
    @Operation(summary = "Получить пользователей с минимальным опытом")
    public ResponseEntity<List<User>> getUsersByMinExperience(
            @Parameter(description = "Минимальный опыт") @PathVariable Integer minExperience) {
        List<User> users = userService.getUsersByMinExperience(minExperience);
        return ResponseEntity.ok(users);
    }
    
    // ========== USER STATS ENDPOINTS ==========
    
    @PostMapping("/{id}/experience")
    @Operation(summary = "Добавить опыт пользователю")
    public ResponseEntity<User> addExperience(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "Количество опыта") @RequestParam Integer experience) {
        try {
            User user = userService.addExperience(id, experience);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/mana")
    @Operation(summary = "Добавить ману пользователю")
    public ResponseEntity<User> addMana(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "Количество маны") @RequestParam Integer mana) {
        try {
            User user = userService.addMana(id, mana);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/mana/spend")
    @Operation(summary = "Потратить ману пользователя")
    public ResponseEntity<User> spendMana(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "Количество маны для траты") @RequestParam Integer mana) {
        try {
            User user = userService.spendMana(id, mana);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ========== COMPETENCY ENDPOINTS ==========
    
    @GetMapping("/competencies")
    @Operation(summary = "Получить все компетенции")
    public ResponseEntity<List<Competency>> getAllCompetencies() {
        List<Competency> competencies = userService.getAllCompetencies();
        return ResponseEntity.ok(competencies);
    }
    
    @GetMapping("/{id}/competencies")
    @Operation(summary = "Получить компетенции пользователя")
    public ResponseEntity<List<UserCompetency>> getUserCompetencies(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        List<UserCompetency> competencies = userService.getUserCompetencies(id);
        return ResponseEntity.ok(competencies);
    }
    
    @PostMapping("/{id}/competencies")
    @Operation(summary = "Добавить компетенцию пользователю")
    public ResponseEntity<UserCompetency> addUserCompetency(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID компетенции") @RequestParam Long competencyId,
            @Parameter(description = "Начальный уровень") @RequestParam(required = false) Integer initialLevel) {
        try {
            UserCompetency userCompetency = userService.addUserCompetency(id, competencyId, initialLevel);
            return ResponseEntity.status(HttpStatus.CREATED).body(userCompetency);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/competencies/{competencyId}")
    @Operation(summary = "Обновить уровень компетенции пользователя")
    public ResponseEntity<UserCompetency> updateCompetencyLevel(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID компетенции") @PathVariable Long competencyId,
            @Parameter(description = "Новый уровень") @RequestParam Integer newLevel,
            @Parameter(description = "Очки опыта") @RequestParam(required = false) Integer experiencePoints) {
        try {
            UserCompetency userCompetency = userService.updateCompetencyLevel(id, competencyId, newLevel, experiencePoints);
            return ResponseEntity.ok(userCompetency);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // ========== ARTIFACT ENDPOINTS ==========
    
    @GetMapping("/artifacts")
    @Operation(summary = "Получить все артефакты")
    public ResponseEntity<List<Artifact>> getAllArtifacts() {
        List<Artifact> artifacts = userService.getAllArtifacts();
        return ResponseEntity.ok(artifacts);
    }
    
    @GetMapping("/{id}/artifacts")
    @Operation(summary = "Получить артефакты пользователя")
    public ResponseEntity<List<UserArtifact>> getUserArtifacts(
            @Parameter(description = "ID пользователя") @PathVariable Long id) {
        List<UserArtifact> artifacts = userService.getUserArtifacts(id);
        return ResponseEntity.ok(artifacts);
    }
    
    @PostMapping("/{id}/artifacts")
    @Operation(summary = "Добавить артефакт пользователю")
    public ResponseEntity<UserArtifact> addUserArtifact(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID артефакта") @RequestParam Long artifactId) {
        try {
            UserArtifact userArtifact = userService.addUserArtifact(id, artifactId);
            return ResponseEntity.status(HttpStatus.CREATED).body(userArtifact);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/artifacts/{artifactId}/equip")
    @Operation(summary = "Экипировать артефакт")
    public ResponseEntity<UserArtifact> equipArtifact(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID артефакта") @PathVariable Long artifactId) {
        try {
            UserArtifact userArtifact = userService.equipArtifact(id, artifactId);
            return ResponseEntity.ok(userArtifact);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/artifacts/{artifactId}/unequip")
    @Operation(summary = "Снять артефакт")
    public ResponseEntity<UserArtifact> unequipArtifact(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @Parameter(description = "ID артефакта") @PathVariable Long artifactId) {
        try {
            UserArtifact userArtifact = userService.unequipArtifact(id, artifactId);
            return ResponseEntity.ok(userArtifact);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
