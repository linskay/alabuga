package com.example.alabuga.entity;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Сущность артефакта")
public class Artifact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор артефакта", example = "1")
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    @Schema(description = "Название артефакта", example = "Меч Кодера")
    private String name;

    @Column(name = "description", length = 500)
    @Schema(description = "Описание артефакта", example = "Легендарный меч, увеличивающий скорость программирования")
    private String description;

    @Column(name = "rarity", nullable = false)
    @Enumerated(EnumType.STRING)
    @Schema(description = "Редкость артефакта", example = "LEGENDARY")
    private ArtifactRarity rarity;

    @Column(name = "power_level", nullable = false)
    @Schema(description = "Уровень силы артефакта", example = "100")
    private Integer powerLevel;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    @Schema(description = "Активен ли артефакт", example = "true")
    private Boolean isActive = true;

    @Schema(description = "Редкость артефактов")
    public enum ArtifactRarity {
        @Schema(description = "Обычный артефакт", example = "COMMON")
        COMMON("Обычный"),
        
        @Schema(description = "Редкий артефакт", example = "RARE")
        RARE("Редкий"),
        
        @Schema(description = "Эпический артефакт", example = "EPIC")
        EPIC("Эпический"),
        
        @Schema(description = "Легендарный артефакт", example = "LEGENDARY")
        LEGENDARY("Легендарный");

        private final String displayName;

        ArtifactRarity(String displayName) {
            this.displayName = displayName;
        }

        @Schema(description = "Отображаемое название редкости")
        public String getDisplayName() {
            return displayName;
        }
    }
}