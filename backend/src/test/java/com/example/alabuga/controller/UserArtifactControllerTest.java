package com.example.alabuga.controller;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.service.user.UserArtifactService;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тесты UserArtifactController")
class UserArtifactControllerTest {

    @Mock
    private UserArtifactService userArtifactService;

    @InjectMocks
    private UserArtifactController userArtifactController;

    @Test
    @DisplayName("должен возвращать все артефакты")
    void shouldReturnAllArtifacts() {
        List<ArtifactDTO> expectedArtifacts = List.of(
                ArtifactDTO.builder().id(1L).name("Артефакт 1").rarity(Artifact.ArtifactRarity.COMMON).build(),
                ArtifactDTO.builder().id(2L).name("Артефакт 2").rarity(Artifact.ArtifactRarity.RARE).build()
        );

        when(userArtifactService.getAllAvailableArtifacts()).thenReturn(expectedArtifacts);

        List<ArtifactDTO> result = userArtifactController.getAllArtifacts().getBody();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Артефакт 1");
        assertThat(result.get(1).getName()).isEqualTo("Артефакт 2");
    }

    @Test
    @DisplayName("должен экипировать артефакт")
    void shouldEquipArtifact() {
        UserArtifactDTO expectedArtifact = UserArtifactDTO.builder()
                .id(1L)
                .name("Артефакт 1")
                .isEquipped(true)
                .build();

        when(userArtifactService.equipArtifact(1L, 1L)).thenReturn(expectedArtifact);

        UserArtifactDTO result = userArtifactController.equipArtifact(1L, 1L).getBody();

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Артефакт 1");
        assertThat(result.getIsEquipped()).isTrue();
    }
}
