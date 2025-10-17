package com.example.alabuga.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.alabuga.entity.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @Schema(description = "Логин пользователя", example = "admin", required = true)
    @NotBlank(message = "Логин не может быть пустым")
    @Size(min = 3, max = 50, message = "Логин должен содержать от 3 до 50 символов")
    private String login;

    @Schema(description = "Email пользователя", example = "admin@alabuga.com", required = true)
    @NotBlank(message = "Email не может быть пустым")
    @Email(message = "Некорректный формат email")
    @Size(max = 100, message = "Email не может превышать 100 символов")
    private String email;

    @Schema(description = "Имя пользователя", example = "Админ", required = true)
    @NotBlank(message = "Имя не может быть пустым")
    @Size(min = 1, max = 50, message = "Имя должно содержать от 1 до 50 символов")
    private String firstName;

    @Schema(description = "Фамилия пользователя", example = "Системы", required = true)
    @NotBlank(message = "Фамилия не может быть пустой")
    @Size(min = 1, max = 50, message = "Фамилия должна содержать от 1 до 50 символов")
    private String lastName;

    @Schema(description = "Роль пользователя", example = "HR")
    @NotNull(message = "Роль пользователя обязательна")
    private UserRole role;

    @Schema(description = "Опыт пользователя", example = "5000")
    @Min(value = 0, message = "Опыт не может быть отрицательным")
    private Integer experience;

    @Schema(description = "Энергоны пользователя", example = "200")
    @Min(value = 0, message = "Энергоны не могут быть отрицательными")
    private Integer energy;

    @Schema(description = "Ранг пользователя", example = "5")
    @Min(value = 1, message = "Ранг должен быть не менее 1")
    private Integer rank;

    @Schema(description = "ID ветки", example = "1")
    private Long branchId;

    @Schema(description = "Дата создания", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime createdAt;

    @Schema(description = "Активен ли пользователь", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Дата последнего обновления", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime updatedAt;
    
    @JsonIgnore
    @Schema(hidden = true)
    private List<UserCompetencyDTO> competencies;
    
    @JsonIgnore
    @Schema(hidden = true)
    private List<UserArtifactDTO> artifacts;
}
