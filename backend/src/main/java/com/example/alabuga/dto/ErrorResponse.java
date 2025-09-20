package com.example.alabuga.dto;

import java.time.LocalDateTime;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для ответа об ошибке")
public class ErrorResponse {
    
    @Schema(description = "Время возникновения ошибки", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime timestamp;
    
    @Schema(description = "HTTP статус код", example = "404")
    private int status;
    
    @Schema(description = "Код ошибки", example = "RESOURCE_NOT_FOUND")
    private String error;
    
    @Schema(description = "Сообщение об ошибке", example = "Пользователь с идентификатором '999' не найден")
    private String message;
    
    @Schema(description = "Путь запроса", example = "/api/users/999")
    private String path;
    
    @Schema(description = "Детали ошибки валидации")
    private List<ValidationError> validationErrors;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Детали ошибки валидации")
    public static class ValidationError {
        
        @Schema(description = "Поле с ошибкой", example = "email")
        private String field;
        
        @Schema(description = "Отклоненное значение", example = "invalid-email")
        private Object rejectedValue;
        
        @Schema(description = "Сообщение об ошибке", example = "Некорректный формат email")
        private String message;
    }
}
