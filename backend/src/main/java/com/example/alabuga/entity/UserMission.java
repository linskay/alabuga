package com.example.alabuga.entity;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "user_missions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Сущность прогресса пользователя по миссии")
public class UserMission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(description = "Пользователь")
    private User user;

    @ManyToOne
    @JoinColumn(name = "mission_id", nullable = false)
    @Schema(description = "Миссия")
    private Mission mission;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    @Schema(description = "Статус выполнения миссии", defaultValue = "NOT_STARTED")
    private MissionStatus status = MissionStatus.NOT_STARTED;

    @Column(name = "progress", nullable = false)
    @Builder.Default
    @Schema(description = "Прогресс выполнения (0-100)", example = "0", defaultValue = "0")
    private Integer progress = 0;

    @Column(name = "started_at")
    @Schema(description = "Дата начала выполнения")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    @Schema(description = "Дата завершения")
    private LocalDateTime completedAt;

    @Column(name = "notes", length = 500)
    @Schema(description = "Заметки пользователя", example = "Сложная миссия, но интересная")
    private String notes;
}
