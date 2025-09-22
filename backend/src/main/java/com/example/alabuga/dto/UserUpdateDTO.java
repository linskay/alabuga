package com.example.alabuga.dto;

import com.example.alabuga.entity.UserRole;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для обновления пользователя")
public class UserUpdateDTO {
    
    @Size(min = 3, max = 50, message = "Логин должен содержать от 3 до 50 символов")
    @Schema(description = "Логин пользователя", example = "newlogin", minLength = 3, maxLength = 50)
    private String login;
    
    @Email(message = "Некорректный формат email")
    @Size(max = 100, message = "Email не может содержать более 100 символов")
    @Schema(description = "Email пользователя", example = "newemail@example.com", maxLength = 100)
    private String email;
    
    @Size(min = 6, message = "Пароль должен содержать минимум 6 символов")
    @Schema(description = "Новый пароль пользователя", example = "newpassword123", minLength = 6)
    private String password;
    
    @Size(max = 50, message = "Имя не может содержать более 50 символов")
    @Schema(description = "Имя пользователя", example = "Новое Имя", maxLength = 50)
    private String firstName;
    
    @Size(max = 50, message = "Фамилия не может содержать более 50 символов")
    @Schema(description = "Фамилия пользователя", example = "Новая Фамилия", maxLength = 50)
    private String lastName;
    
    @Schema(description = "Роль пользователя", example = "ADMIN")
    private UserRole role;
    
    @Schema(description = "Опыт пользователя", example = "1000")
    private Integer experience;
    
    @Schema(description = "Энергоны пользователя", example = "150")
    private Integer energy;
    
    @Schema(description = "Ранг пользователя", example = "2")
    private Integer rank;
    
    @Schema(description = "Активен ли пользователь", example = "true")
    private Boolean isActive;
}
