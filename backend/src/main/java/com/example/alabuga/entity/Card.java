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
@Table(name = "cards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Сущность карты")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор карты", example = "1")
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    @Schema(description = "Название карты", example = "Космо-Кадет")
    private String name;

    @Column(name = "series_name", nullable = false, length = 100)
    @Schema(description = "Название серии карт", example = "Восхождение по иерархии Флота")
    private String seriesName;

    @Column(name = "front_image_url", length = 500)
    @Schema(description = "URL изображения лицевой стороны", example = "/images/cards/cosmo-cadet-front.jpg")
    private String frontImageUrl;

    @Column(name = "back_description", length = 1000)
    @Schema(description = "Описание на оборотной стороне", example = "Первый корабль. Первый выход в открытый космос...")
    private String backDescription;

    // @Column(name = "rarity", nullable = false)
    // @Enumerated(EnumType.STRING)
    // @Schema(description = "Редкость карты", example = "COMMON")
    // private CardRarity rarity;

    @Column(name = "unlock_condition", length = 500)
    @Schema(description = "Условие разблокировки карты", example = "Получение ранга Космо-Кадет")
    private String unlockCondition;

    @Column(name = "unlock_rank")
    @Schema(description = "Ранг для разблокировки карты", example = "0")
    private Integer unlockRank;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    @Schema(description = "Активна ли карта", example = "true")
    private Boolean isActive = true;
}
