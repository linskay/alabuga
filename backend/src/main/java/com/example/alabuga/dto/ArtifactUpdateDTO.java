package com.example.alabuga.dto;

import com.example.alabuga.entity.Artifact.ArtifactRarity;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "DTO для обновления артефакта")
public class ArtifactUpdateDTO {

    @Size(min = 1, max = 100, message = "Название артефакта должно содержать от 1 до 100 символов")
    @Schema(description = "Название артефакта", example = "Меч Кодера")
    private String name;

    @Size(max = 200, message = "Краткое описание не может превышать 200 символов")
    @Schema(description = "Краткое описание артефакта", example = "Увеличивает скорость программирования")
    private String shortDescription;

    @Size(max = 500, message = "URL изображения не может превышать 500 символов")
    @Schema(description = "URL изображения артефакта", example = "https://example.com/images/sword-coder.jpg")
    private String imageUrl;

    @Schema(description = "Редкость артефакта", example = "LEGENDARY")
    private ArtifactRarity rarity;

    @Schema(description = "Активен ли артефакт", example = "true")
    private Boolean isActive;
}
