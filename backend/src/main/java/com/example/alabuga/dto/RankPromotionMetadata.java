package com.example.alabuga.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Метаданные для уведомления о повышении ранга")
public class RankPromotionMetadata {

    @Schema(description = "Уровень старого ранга", example = "1")
    private Integer oldRankLevel;

    @Schema(description = "Название старого ранга", example = "Навигатор Траекторий")
    private String oldRankName;

    @Schema(description = "Уровень нового ранга", example = "2")
    private Integer newRankLevel;

    @Schema(description = "Название нового ранга", example = "Аналитик Данных")
    private String newRankName;
}
