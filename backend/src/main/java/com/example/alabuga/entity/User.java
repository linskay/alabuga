package com.example.alabuga.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"competencies", "artifacts"})
@Schema(description = "Сущность пользователя")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор пользователя", example = "1")
    private Long id;
    
    @Column(name = "login", nullable = false, unique = true, length = 50)
    @Schema(description = "Логин пользователя", example = "admin")
    private String login;
    
    @Column(name = "email", nullable = false, unique = true, length = 100)
    @Schema(description = "Email пользователя", example = "admin@alabuga.com")
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    @Builder.Default
    @Schema(description = "Хеш пароля пользователя", example = "$2a$10$...")
    private String passwordHash = "default_password";
    
    @Column(name = "first_name", nullable = false, length = 50)
    @Schema(description = "Имя пользователя", example = "Админ")
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 50)
    @Schema(description = "Фамилия пользователя", example = "Системы")
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    @Schema(description = "Роль пользователя", example = "HR")
    private UserRole role = UserRole.USER;
    
    @Column(name = "experience", nullable = false)
    @Builder.Default
    @Schema(description = "Опыт пользователя", example = "5000")
    private Integer experience = 0;
    
    @Column(name = "energy", nullable = false)
    @Builder.Default
    @Schema(description = "Энергоны пользователя", example = "200")
    private Integer energy = 100;
    
    @Column(name = "rank", nullable = false)
    @Builder.Default
    @Schema(description = "Ранг пользователя", example = "0")
    private Integer rank = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @Schema(description = "Дата создания", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    @Schema(description = "Дата последнего обновления", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime updatedAt;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    @Schema(description = "Активен ли пользователь", example = "true")
    private Boolean isActive = true;
    
    // Связи с компетенциями и артефактами
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("user")
    @Schema(description = "Компетенции пользователя")
    private List<UserCompetency> competencies;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("user")
    @Schema(description = "Артефакты пользователя")
    private List<UserArtifact> artifacts;
}