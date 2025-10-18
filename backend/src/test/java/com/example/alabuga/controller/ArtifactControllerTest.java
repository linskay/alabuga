package com.example.alabuga.controller;

import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.service.ArtifactService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тесты ArtifactController")
class ArtifactControllerTest {

    @Mock
    private ArtifactService artifactService;

    @InjectMocks
    private ArtifactController artifactController;

    @Test
    @DisplayName("должен возвращать все артефакты")
    void shouldReturnAllArtifacts() {
        List<ArtifactDTO> expectedArtifacts = List.of(
                ArtifactDTO.builder().id(1L).name("Артефакт 1").rarity(Artifact.ArtifactRarity.COMMON).isActive(true).build(),
                ArtifactDTO.builder().id(2L).name("Артефакт 2").rarity(Artifact.ArtifactRarity.RARE).isActive(true).build()
        );

        when(artifactService.getAllArtifacts()).thenReturn(expectedArtifacts);

        List<ArtifactDTO> result = artifactController.getAllArtifacts().getBody();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Артефакт 1");
        assertThat(result.get(1).getName()).isEqualTo("Артефакт 2");
    }

    @Test
    @DisplayName("должен возвращать артефакт по ID")
    void shouldReturnArtifactById() {
        ArtifactDTO expectedArtifact = ArtifactDTO.builder()
                .id(1L)
                .name("Тестовый Артефакт")
                .rarity(Artifact.ArtifactRarity.LEGENDARY)
                .isActive(true)
                .build();

        when(artifactService.getArtifactById(1L)).thenReturn(expectedArtifact);

        ArtifactDTO result = artifactController.getArtifactById(1L).getBody();

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Тестовый Артефакт");
        assertThat(result.getRarity()).isEqualTo(Artifact.ArtifactRarity.LEGENDARY);
    }
}
