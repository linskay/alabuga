package com.example.alabuga.dto;

import com.example.alabuga.entity.Rank.RankBranch;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для ранга")
public class RankDTO {
    
    @Schema(description = "Уровень ранга", example = "1")
    private Integer level;
    
    @Schema(description = "Название ранга", example = "Навигатор Траекторий")
    private String name;
    
    @Schema(description = "Описание ранга", example = "Специалист по расчету космических траекторий")
    private String description;
    
    @Schema(description = "Ветка развития", example = "ANALYTICAL_TECHNICAL")
    private RankBranch branch;
    
    @Schema(description = "Отображаемое название ветки", example = "Аналитико-Техническая")
    private String branchDisplayName;
}
