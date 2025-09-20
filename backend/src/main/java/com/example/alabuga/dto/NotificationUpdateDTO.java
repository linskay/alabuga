package com.example.alabuga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для обновления системного уведомления")
public class NotificationUpdateDTO {

    @Size(max = 200, message = "Заголовок уведомления не может превышать 200 символов")
    @Schema(description = "Заголовок уведомления", example = "Обновленный заголовок")
    private String title;

    @Schema(description = "Содержимое уведомления", example = "Обновленное содержимое")
    private String content;

    @Schema(description = "Прочитано ли уведомление", example = "true")
    private Boolean isRead;

    @Size(max = 1000, message = "Метаданные не могут превышать 1000 символов")
    @Schema(description = "Дополнительные данные в JSON формате", example = "{\"updated\": true}")
    private String metadata;
}
