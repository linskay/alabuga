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
@Table(name = "missions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Сущность миссии")
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор миссии", example = "1")
    private Long id;

    @Column(name = "name", nullable = false, length = 200)
    @Schema(description = "Название миссии", example = "Первые шаги в космосе")
    private String name;

    @Column(name = "description", length = 1000)
    @Schema(description = "Описание миссии", example = "Изучите основы космических путешествий")
    private String description;

    @Column(name = "branch_id", nullable = false)
    @Schema(description = "ID ветки миссии", example = "1")
    private Long branchId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    @Schema(description = "Тип миссии")
    private MissionType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false)
    @Schema(description = "Сложность миссии")
    private MissionDifficulty difficulty;

    @Column(name = "experience_reward", nullable = false)
    @Schema(description = "Награда опыта", example = "50")
    private Integer experienceReward;

    @Column(name = "mana_reward", nullable = false)
    @Schema(description = "Награда маны", example = "25")
    private Integer manaReward;

    @Column(name = "required_competencies", length = 500)
    @Schema(description = "Требуемые компетенции (JSON)", example = "[\"navigation\", \"engineering\"]")
    private String requiredCompetencies;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    @Schema(description = "Активна ли миссия", example = "true", defaultValue = "true")
    private Boolean isActive = true;
}
