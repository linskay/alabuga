package com.example.alabuga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для создания системного уведомления")
public class NotificationCreateDTO {

    @NotNull(message = "ID пользователя обязателен")
    @Schema(description = "ID пользователя", example = "1", required = true)
    private Long userId;

    @NotBlank(message = "Заголовок уведомления не может быть пустым")
    @Size(max = 200, message = "Заголовок уведомления не может превышать 200 символов")
    @Schema(description = "Заголовок уведомления", example = "СИСТЕМНЫЙ ЖУРНАЛ: ИНИЦИАЦИЯ НОВОГО ЧЛЕНА ЭКИПАЖА", required = true)
    private String title;

    @NotBlank(message = "Содержимое уведомления не может быть пустым")
    @Schema(description = "Содержимое уведомления", example = "ЗАГРУЗКА ПРОТОКОЛА «СТАРТ»...", required = true)
    private String content;

    @NotBlank(message = "Тип уведомления обязателен")
    @Schema(description = "Тип уведомления", example = "RANK_ASSIGNMENT", required = true)
    private String notificationType;


    @Size(max = 1000, message = "Метаданные не могут превышать 1000 символов")
    @Schema(description = "Дополнительные данные в JSON формате", example = "{\"rankLevel\": 0, \"rankName\": \"Космо-Кадет\"}")
    private String metadata;
}
