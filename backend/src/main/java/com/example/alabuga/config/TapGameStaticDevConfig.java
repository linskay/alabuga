package com.example.alabuga.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Profile("dev")
public class TapGameStaticDevConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Register multiple candidate locations to be robust against different working directories
        // Case 1: launched from backend module directory: ../tapgame/src
        Path candidate1 = Paths.get("..", "tapgame", "src").normalize().toAbsolutePath();
        // Case 2: launched from project root directory: ./tapgame/src
        Path candidate2 = Paths.get("tapgame", "src").normalize().toAbsolutePath();
        // Case 3: launched from backend/.. somewhere else: ../../tapgame/src
        Path candidate3 = Paths.get("..", "..", "tapgame", "src").normalize().toAbsolutePath();

        String loc1 = candidate1.toUri().toString();
        String loc2 = candidate2.toUri().toString();
        String loc3 = candidate3.toUri().toString();

        registry.addResourceHandler("/tapgame/**")
                .addResourceLocations(loc1, loc2, loc3)
                .setCachePeriod(0);
    }
}
