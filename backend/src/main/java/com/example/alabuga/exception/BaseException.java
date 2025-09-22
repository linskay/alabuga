package com.example.alabuga.exception;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {
    
    private final String errorCode;
    private final Object[] args;
    
    protected BaseException(String message, String errorCode, Object... args) {
        super(message);
        this.errorCode = errorCode;
        this.args = args;
    }
    
    protected BaseException(String message, Throwable cause, String errorCode, Object... args) {
        super(message, cause);
        this.errorCode = errorCode;
        this.args = args;
    }
}
