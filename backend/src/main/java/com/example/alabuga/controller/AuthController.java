package com.example.alabuga.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.alabuga.dto.UserDTO;
import com.example.alabuga.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "API для аутентификации пользователей")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    @Operation(summary = "Вход в систему")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String login = credentials.get("login");
        String password = credentials.get("password");
        
        if (login == null || login.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Логин не может быть пустым"));
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Пароль не может быть пустым"));
        }
        
        Optional<UserDTO> user = userService.getUserByLogin(login);
        
        if (user.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Пользователь не найден"));
        }
        
        // Проверяем, что пользователь активен
        if (!user.get().getIsActive()) {
            return ResponseEntity.status(401).body(Map.of("error", "Пользователь деактивирован"));
        }
        
        // TODO: заменить на проверку BCrypt-хеша и JWT-токены.
        // Для тестовой среды допускаем пароль == логин для пользователей admin/organizer/user
        String normalized = login.trim().toLowerCase();
        boolean allowedTestUser = normalized.equals("admin") || normalized.equals("organizer") || normalized.equals("user");
        if (allowedTestUser) {
            if (!password.equals(login)) {
                return ResponseEntity.status(401).body(Map.of("error", "Неверный логин или пароль"));
            }
        }
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "user", user.get(),
            "message", "Успешный вход в систему"
        ));
    }

    @PostMapping("/validate")
    @Operation(summary = "Проверка валидности сессии")
    public ResponseEntity<?> validateSession(@RequestBody Map<String, String> request) {
        String login = request.get("login");
        
        if (login == null || login.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Логин не может быть пустым"));
        }
        
        Optional<UserDTO> user = userService.getUserByLogin(login);
        
        if (user.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Пользователь не найден"));
        }
        
        if (!user.get().getIsActive()) {
            return ResponseEntity.status(401).body(Map.of("error", "Пользователь деактивирован"));
        }
        
        return ResponseEntity.ok(Map.of(
            "valid", true,
            "user", user.get()
        ));
    }
}
