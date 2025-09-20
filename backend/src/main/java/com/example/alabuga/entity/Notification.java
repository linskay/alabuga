package com.example.alabuga.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"user"})
@Schema(description = "Сущность системного уведомления")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор уведомления", example = "1")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(description = "Пользователь, которому адресовано уведомление")
    private User user;

    @Column(name = "title", nullable = false, length = 200)
    @Schema(description = "Заголовок уведомления", example = "СИСТЕМНЫЙ ЖУРНАЛ: ИНИЦИАЦИЯ НОВОГО ЧЛЕНА ЭКИПАЖА")
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    @Schema(description = "Содержимое уведомления", example = "ЗАГРУЗКА ПРОТОКОЛА «СТАРТ»...")
    private String content;

    @Column(name = "notification_type", nullable = false, length = 50)
    @Schema(description = "Тип уведомления", example = "RANK_ASSIGNMENT")
    private String notificationType;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    @Schema(description = "Прочитано ли уведомление", example = "false")
    private Boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @Schema(description = "Дата создания уведомления", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime createdAt;

    @Column(name = "metadata", length = 1000)
    @Schema(description = "Дополнительные данные в JSON формате", example = "{\"rankLevel\": 0, \"rankName\": \"Космо-Кадет\"}")
    private String metadata;

    @Schema(description = "Типы системных уведомлений")
    public enum NotificationType {
        @Schema(description = "Присвоение ранга")
        RANK_ASSIGNMENT("RANK_ASSIGNMENT", "Присвоение ранга"),
        
        @Schema(description = "Повышение ранга")
        RANK_PROMOTION("RANK_PROMOTION", "Повышение ранга"),
        
        @Schema(description = "Завершение миссии")
        MISSION_COMPLETED("MISSION_COMPLETED", "Завершение миссии"),
        
        @Schema(description = "Получение артефакта")
        ARTIFACT_ACQUIRED("ARTIFACT_ACQUIRED", "Получение артефакта"),
        
        @Schema(description = "Покупка в магазине")
        SHOP_PURCHASE("SHOP_PURCHASE", "Покупка в магазине"),
        
        @Schema(description = "Системное сообщение")
        SYSTEM_MESSAGE("SYSTEM_MESSAGE", "Системное сообщение"),
        
        @Schema(description = "Достижение")
        ACHIEVEMENT("ACHIEVEMENT", "Достижение");

        private final String code;
        private final String displayName;

        NotificationType(String code, String displayName) {
            this.code = code;
            this.displayName = displayName;
        }

        public String getCode() {
            return code;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
