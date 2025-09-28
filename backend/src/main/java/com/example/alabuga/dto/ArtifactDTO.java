package com.example.alabuga.dto;

import com.example.alabuga.entity.Artifact;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO артефакта")
public class ArtifactDTO {

    @Schema(description = "ID артефакта", example = "1")
    private Long id;

    @Schema(description = "Название артефакта", example = "Меч Кодера", required = true)
    private String name;

    @Schema(description = "Краткое описание артефакта", example = "Увеличивает скорость программирования")
    private String shortDescription;

    @Schema(description = "URL изображения артефакта", example = "https://example.com/images/sword-coder.jpg")
    private String imageUrl;

    @Schema(description = "Редкость артефакта", example = "LEGENDARY")
    private Artifact.ArtifactRarity rarity;

    @Schema(description = "Активен ли артефакт", example = "true")
    private Boolean isActive;

    public static ArtifactDTO fromEntity(Artifact artifact) {
        return ArtifactDTO.builder()
                .id(artifact.getId())
                .name(artifact.getName())
                .shortDescription(artifact.getShortDescription())
                .imageUrl(artifact.getImageUrl())
                .rarity(artifact.getRarity())
                .isActive(artifact.getIsActive())
                .build();
    }
}