package com.example.alabuga.entity;

import java.time.LocalDateTime;

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
@Table(name = "user_artifacts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties("user")
@Schema(description = "Сущность артефакта пользователя")
public class UserArtifact {

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
    @JoinColumn(name = "artifact_id", nullable = false)
    @JsonIgnoreProperties({"userArtifacts"})
    @Schema(description = "Артефакт")
    private Artifact artifact;

    @Column(name = "acquired_at", nullable = false)
    @Schema(description = "Дата получения артефакта", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime acquiredAt;

    @Column(name = "is_equipped", nullable = false)
    @Builder.Default
    @Schema(description = "Экипирован ли артефакт", example = "true", defaultValue = "false")
    private Boolean isEquipped = false;
}