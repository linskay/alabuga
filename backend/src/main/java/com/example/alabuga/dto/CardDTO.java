package com.example.alabuga.dto;

import com.example.alabuga.entity.Card;

import io.swagger.v3.oas.annotations.media.Schema;
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

    @Schema(description = "Название карты", example = "Космо-Кадет")
    private String name;

    @Schema(description = "Название серии", example = "Восхождение по иерархии Флота")
    private String seriesName;

    @Schema(description = "URL изображения", example = "/images/cards/1.jpg")
    private String frontImageUrl;

    @Schema(description = "Описание", example = "Первый корабль...")
    private String backDescription;

    @Schema(description = "Редкость", example = "COMMON")
    private String rarity;

    @Schema(description = "Условие разблокировки", example = "Получение ранга Космо-Кадет")
    private String unlockCondition;

    @Schema(description = "Ранг для разблокировки", example = "0")
    private Integer unlockRank;

    @Schema(description = "Активна ли карта", example = "true")
    private Boolean isActive;

    public static CardDTO fromEntity(Card card) {
        return CardDTO.builder()
                .id(card.getId())
                .name(card.getName())
                .seriesName(card.getSeriesName())
                .frontImageUrl(card.getFrontImageUrl())
                .backDescription(card.getBackDescription())
            //    .rarity(card.getRarity().name())
                .unlockCondition(card.getUnlockCondition())
                .unlockRank(card.getUnlockRank())
                .isActive(card.getIsActive())
                .build();
    }
}
