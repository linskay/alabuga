package com.example.alabuga.security;

import jakarta.servlet.http.HttpServletRequest;

public final class AdminGuard {
    private AdminGuard() {}

    public static void assertAdmin(HttpServletRequest request) {
        // Simple temporary guard: expects header X-ROLE=ADMIN
        // Replace with Spring Security @PreAuthorize when integrated
        String role = request.getHeader("X-ROLE");
        if (role == null || !"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("FORBIDDEN: Admin role required");
        }
    }
}
