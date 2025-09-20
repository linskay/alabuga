package com.example.alabuga.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_competencies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties("user")
@Schema(description = "Сущность компетенции пользователя")
public class UserCompetency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор записи", example = "1")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"competencies", "artifacts"})
    @Schema(description = "Пользователь")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competency_id", nullable = false)
    @JsonIgnoreProperties({"userCompetencies"})
    @Schema(description = "Компетенция")
    private Competency competency;

    @Column(name = "current_level", nullable = false)
    @Builder.Default
    @Schema(description = "Текущий уровень компетенции", example = "95", defaultValue = "0")
    private Integer currentLevel = 0;

    @Column(name = "experience_points", nullable = false)
    @Builder.Default
    @Schema(description = "Очки опыта в компетенции", example = "9500", defaultValue = "0")
    private Integer experiencePoints = 0;
}