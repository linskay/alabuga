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
        // Resolve path to tapgame/src directory from backend module
        Path backendPath = Paths.get("").toAbsolutePath();
        // backendPath -> .../alabuga/backend
        Path tapgameSrc = backendPath.getParent().resolve("tapgame").resolve("src");
        String location = tapgameSrc.toUri().toString();

        registry.addResourceHandler("/tapgame/**")
                .addResourceLocations(location)
                .setCachePeriod(0);
    }
}
