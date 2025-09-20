package com.example.alabuga.dto;

import com.example.alabuga.entity.UserRole;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для создания пользователя")
public class UserCreateDTO {
    
    @NotBlank(message = "Логин не может быть пустым")
    @Size(min = 3, max = 50, message = "Логин должен содержать от 3 до 50 символов")
    @Schema(description = "Логин пользователя", example = "testuser", required = true, minLength = 3, maxLength = 50)
    private String login;
    
    @NotBlank(message = "Email не может быть пустым")
    @Email(message = "Некорректный формат email")
    @Size(max = 100, message = "Email не может содержать более 100 символов")
    @Schema(description = "Email пользователя", example = "test@example.com", required = true, maxLength = 100)
    private String email;
    
    @NotBlank(message = "Пароль не может быть пустым")
    @Size(min = 6, message = "Пароль должен содержать минимум 6 символов")
    @Schema(description = "Пароль пользователя", example = "password123", required = true, minLength = 6)
    private String password;
    
    @NotBlank(message = "Имя не может быть пустым")
    @Size(max = 50, message = "Имя не может содержать более 50 символов")
    @Schema(description = "Имя пользователя", example = "Тест", required = true, maxLength = 50)
    private String firstName;
    
    @NotBlank(message = "Фамилия не может быть пустой")
    @Size(max = 50, message = "Фамилия не может содержать более 50 символов")
    @Schema(description = "Фамилия пользователя", example = "Пользователь", required = true, maxLength = 50)
    private String lastName;
    
    @Builder.Default
    @Schema(description = "Роль пользователя", example = "USER", defaultValue = "USER")
    private UserRole role = UserRole.USER;
    
    @Builder.Default
    @Schema(description = "Начальный опыт пользователя", example = "0", defaultValue = "0")
    private Integer experience = 0;
    
    @Builder.Default
    @Schema(description = "Начальные Энергоны пользователя", example = "100", defaultValue = "100")
    private Integer energy = 100;
    
    @Builder.Default
    @Schema(description = "Начальный ранг пользователя", example = "1", defaultValue = "1")
    private Integer rank = 1;
}
