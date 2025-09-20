package com.example.alabuga.entity;

public enum UserRole {
    USER("Пользователь"),
    ORGANIZER("Организатор"),
    HR("HR (Админ)");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
