package com.example.alabuga.dto;

import com.example.alabuga.entity.Card;

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
@Schema(description = "DTO карты")
public class CardDTO {

    @Schema(description = "ID карты", example = "1")
    private Long id;

    @Schema(description = "Название карты", example = "Космо-Кадет", required = true)
    @NotBlank(message = "Название карты не может быть пустым")
    @Size(min = 1, max = 100, message = "Название карты должно содержать от 1 до 100 символов")
    private String name;

    @Schema(description = "Название серии", example = "Восхождение по иерархии Флота", required = true)
    @NotBlank(message = "Название серии не может быть пустым")
    @Size(min = 1, max = 100, message = "Название серии должно содержать от 1 до 100 символов")
    private String seriesName;

    @Schema(description = "URL изображения", example = "/images/cards/1.jpg")
    @Size(max = 500, message = "URL изображения не может превышать 500 символов")
    private String frontImageUrl;

    @Schema(description = "Описание", example = "Первый корабль...")
    @Size(max = 1000, message = "Описание не может превышать 1000 символов")
    private String backDescription;

    @Schema(description = "Условие разблокировки", example = "Получение ранга Космо-Кадет")
    @Size(max = 500, message = "Условие разблокировки не может превышать 500 символов")
    private String unlockCondition;

    @Schema(description = "Ранг для разблокировки", example = "0")
    @NotNull(message = "Ранг для разблокировки обязателен")
    private Integer unlockRank;

    @Schema(description = "Активна ли карта", example = "true")
    @NotNull(message = "Статус активности обязателен")
    private Boolean isActive;

    public static CardDTO fromEntity(Card card) {
        return CardDTO.builder()
                .id(card.getId())
                .name(card.getName())
                .seriesName(card.getSeriesName())
                .frontImageUrl(card.getFrontImageUrl())
                .backDescription(card.getBackDescription())
                .unlockCondition(card.getUnlockCondition())
                .unlockRank(card.getUnlockRank())
                .isActive(card.getIsActive())
                .build();
    }
}
