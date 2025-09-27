package com.example.alabuga.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackages = {
        "tapgame.entity"
})
@EnableJpaRepositories(basePackages = {
        "tapgame.repository"
})
@ComponentScan(basePackages = {
        "tapgame"
})
public class TapGameConfig {
    // This configuration enables scanning tapgame package without touching main app classes
}
