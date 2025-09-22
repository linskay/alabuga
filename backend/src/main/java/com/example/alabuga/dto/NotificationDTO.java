package com.example.alabuga.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для системного уведомления")
public class NotificationDTO {

    @Schema(description = "Уникальный идентификатор уведомления", example = "1")
    private Long id;

    @Schema(description = "ID пользователя", example = "1")
    private Long userId;

    @Schema(description = "Заголовок уведомления", example = "СИСТЕМНЫЙ ЖУРНАЛ: ИНИЦИАЦИЯ НОВОГО ЧЛЕНА ЭКИПАЖА")
    private String title;

    @Schema(description = "Содержимое уведомления", example = "ЗАГРУЗКА ПРОТОКОЛА «СТАРТ»...")
    private String content;

    @Schema(description = "Тип уведомления", example = "RANK_ASSIGNMENT")
    private String notificationType;

    @Schema(description = "Отображаемое название типа", example = "Присвоение ранга")
    private String notificationTypeDisplayName;

    @Schema(description = "Прочитано ли уведомление", example = "false")
    private Boolean isRead;


    @Schema(description = "Дата создания уведомления", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime createdAt;

    @Schema(description = "Дополнительные данные в JSON формате", example = "{\"rankLevel\": 0, \"rankName\": \"Космо-Кадет\"}")
    private String metadata;
}
