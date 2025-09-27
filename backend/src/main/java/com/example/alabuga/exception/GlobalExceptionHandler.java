package com.example.alabuga.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
@Order(1)
public class GlobalExceptionHandler {

    /**
     * Обработка ошибок валидации @Valid
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("success", false);
        response.put("title", "Ошибка валидации");
        response.put("message", "Проверьте введенные данные");
        response.put("errors", errors);
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Обработка ошибок валидации ConstraintViolationException
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("title", "Ошибка валидации");
        response.put("message", ex.getMessage());
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Обработка ResourceNotFoundException
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("title", "Ресурс не найден");
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    /**
     * Обработка BusinessLogicException
     */
    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessLogicException(BusinessLogicException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("title", "Ошибка бизнес-логики");
        response.put("message", ex.getMessage());
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Обработка общих исключений
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex, WebRequest request) {
        // Исключаем пути SpringDoc OpenAPI из глобальной обработки ошибок
        String requestPath = request.getDescription(false);
        if (requestPath.contains("/v3/api-docs") || 
            requestPath.contains("/swagger-ui") || 
            requestPath.contains("/api-docs") ||
            requestPath.contains("springdoc") ||
            requestPath.contains("swagger")) {
            // Не обрабатываем исключения для SpringDoc - пробрасываем их дальше
            throw new RuntimeException(ex);
        }
        
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("title", "Внутренняя ошибка сервера");
        response.put("message", "Произошла неожиданная ошибка");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}