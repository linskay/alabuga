package com.example.alabuga.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Profile("prod")
public class TapGameStaticProdConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve tapgame static files packaged inside the JAR under classpath:/tapgame/
        registry.addResourceHandler("/tapgame/**")
                .addResourceLocations("classpath:/tapgame/")
                .setCachePeriod(3600);
    }
}
