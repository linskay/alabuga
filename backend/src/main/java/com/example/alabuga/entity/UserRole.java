package com.example.alabuga.entity;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Роли пользователей в системе")
public enum UserRole {
    @Schema(description = "Обычный пользователь", example = "USER")
    USER("Пользователь"),
    
    @Schema(description = "Организатор событий", example = "ORGANIZER")
    ORGANIZER("Организатор"),
    
    @Schema(description = "HR администратор", example = "HR")
    HR("HR (Админ)");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    @Schema(description = "Отображаемое название роли")
    public String getDisplayName() {
        return displayName;
    }
}
