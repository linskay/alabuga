package com.example.tapgame;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@ComponentScan(basePackages = {"tapgame"})
@EnableJpaRepositories(basePackages = {"tapgame.repository"})
@EntityScan(basePackages = {"tapgame.entity"})
public class TapGameApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(TapGameApplication.class);
        Map<String, Object> defaults = new HashMap<>();
        defaults.put("spring.profiles.default", "tapgame");
        app.setDefaultProperties(defaults);
        app.setAdditionalProfiles("tapgame");
        app.run(args);
    }
}

