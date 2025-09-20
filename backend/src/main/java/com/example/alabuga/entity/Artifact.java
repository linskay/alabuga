package com.example.alabuga.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "artifacts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Artifact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "rarity", nullable = false)
    @Enumerated(EnumType.STRING)
    private ArtifactRarity rarity;

    @Column(name = "power_level", nullable = false)
    private Integer powerLevel;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    public enum ArtifactRarity {
        COMMON("Обычный"),
        RARE("Редкий"),
        EPIC("Эпический"),
        LEGENDARY("Легендарный");

        private final String displayName;

        ArtifactRarity(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}