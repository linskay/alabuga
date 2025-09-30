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
@Schema(description = "Метаданные для уведомления о присвоении ранга")
public class RankMetadata {

    @Schema(description = "Уровень ранга", example = "1")
    private Integer rankLevel;

    @Schema(description = "Название ранга", example = "Навигатор Траекторий")
    private String rankName;

    @Schema(description = "Ветка развития", example = "ANALYTICAL_TECHNICAL")
    private String branch;
}
