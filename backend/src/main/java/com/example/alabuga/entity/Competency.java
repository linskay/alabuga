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
@Table(name = "competencies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Сущность компетенции")
public class Competency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор компетенции", example = "1")
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    @Schema(description = "Название компетенции", example = "Сила Миссии")
    private String name;

    @Column(name = "short_description", length = 200)
    @Schema(description = "Краткое описание компетенции", example = "Вера в дело")
    private String shortDescription;

    @Column(name = "description", length = 1000)
    @Schema(description = "Полное описание компетенции", example = "Умение держать курс даже тогда, когда звёзды гаснут. Показывает преданность цели и устойчивость в испытаниях.")
    private String description;


    @Column(name = "is_active", nullable = false)
    @Builder.Default
    @Schema(description = "Активна ли компетенция", example = "true", defaultValue = "true")
    private Boolean isActive = true;
}