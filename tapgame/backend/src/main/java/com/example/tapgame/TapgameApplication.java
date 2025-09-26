package com.example.tapgame;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication(scanBasePackages = {"tapgame"})
public class TapgameApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(TapgameApplication.class);
        Map<String, Object> defaults = new HashMap<>();
        defaults.put("spring.profiles.default", "tapgame");
        app.setDefaultProperties(defaults);
        app.run(args);
    }
}
