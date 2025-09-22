package com.example.alabuga.exception;

public class DuplicateResourceException extends BaseException {
    
    public DuplicateResourceException(String resourceType, String field, Object value) {
        super(
            String.format("%s с %s '%s' уже существует", resourceType, field, value),
            "DUPLICATE_RESOURCE",
            resourceType, field, value
        );
    }
    
    public DuplicateResourceException(String message) {
        super(message, "DUPLICATE_RESOURCE");
    }
}
