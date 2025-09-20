package com.example.alabuga.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rank_requirements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Требования для получения ранга")
public class RankRequirements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор требований", example = "1")
    private Long id;

    @Column(name = "rank_level", nullable = false)
    @Schema(description = "Уровень ранга", example = "1")
    private Integer rankLevel;

    @Column(name = "required_experience", nullable = false)
    @Schema(description = "Требуемый опыт", example = "1000")
    private Integer requiredExperience;

    @Column(name = "required_mission_name", length = 200)
    @Schema(description = "Название обязательной миссии", example = "Основы навигации")
    private String requiredMissionName;

    @Column(name = "required_competency_points", nullable = false)
    @Schema(description = "Требуемые очки в компетенциях", example = "100")
    private Integer requiredCompetencyPoints;

    @Column(name = "competency_names", length = 500)
    @Schema(description = "Названия компетенций (JSON)", example = "[\"navigation\", \"engineering\"]")
    private String competencyNames;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    @Schema(description = "Активны ли требования", example = "true")
    private Boolean isActive = true;

    @Column(name = "description", length = 500)
    @Schema(description = "Описание требований", example = "Требуется выполнить миссию по навигации и набрать 100 очков в компетенциях")
    private String description;
}
