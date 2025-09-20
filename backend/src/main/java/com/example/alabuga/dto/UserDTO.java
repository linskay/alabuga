package com.example.alabuga.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.alabuga.entity.UserRole;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для пользователя")
public class UserDTO {
    
    @Schema(description = "Уникальный идентификатор пользователя", example = "1")
    private Long id;
    
    @Schema(description = "Логин пользователя", example = "admin")
    private String login;
    
    @Schema(description = "Email пользователя", example = "admin@alabuga.com")
    private String email;
    
    @Schema(description = "Имя пользователя", example = "Админ")
    private String firstName;
    
    @Schema(description = "Фамилия пользователя", example = "Системы")
    private String lastName;
    
    @Schema(description = "Роль пользователя", example = "HR")
    private UserRole role;
    
    @Schema(description = "Опыт пользователя", example = "5000")
    private Integer experience;
    
    @Schema(description = "Энергоны пользователя", example = "200")
    private Integer energy;
    
    @Schema(description = "Ранг пользователя", example = "5")
    private Integer rank;
    
    @Schema(description = "Дата создания", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime createdAt;
    
    @Schema(description = "Дата последнего обновления", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Активен ли пользователь", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Компетенции пользователя")
    private List<UserCompetencyDTO> competencies;
    
    @Schema(description = "Артефакты пользователя")
    private List<UserArtifactDTO> artifacts;
}
