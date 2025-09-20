package com.example.alabuga.exception;

public class ValidationException extends BaseException {
    
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR");
    }
    
    public ValidationException(String message, Object... args) {
        super(message, "VALIDATION_ERROR", args);
    }
}
