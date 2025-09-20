package com.example.alabuga.exception;

public class ResourceNotFoundException extends BaseException {
    
    public ResourceNotFoundException(String resourceType, Object identifier) {
        super(
            String.format("%s с идентификатором '%s' не найден", resourceType, identifier),
            "RESOURCE_NOT_FOUND",
            resourceType, identifier
        );
    }
    
    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND");
    }
}
