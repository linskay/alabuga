package com.example.alabuga.integration;

import com.example.alabuga.dto.ArtifactCreateDTO;
import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.repository.ArtifactRepository;
import com.example.alabuga.service.ArtifactService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("Интеграционные тесты ArtifactService")
class ArtifactServiceIntegrationTest {

    @Autowired
    private ArtifactService artifactService;

    @Autowired
    private ArtifactRepository artifactRepository;

    @Test
    @DisplayName("должен создавать артефакт в базе данных")
    void shouldCreateArtifactInDatabase() {
        ArtifactCreateDTO createDTO = ArtifactCreateDTO.builder()
                .name("Интеграционный Тест Артефакт")
                .imageUrl("https://example.com/test.jpg")
                .rarity(Artifact.ArtifactRarity.EPIC)
                .isActive(true)
                .build();

        ArtifactDTO result = artifactService.createArtifact(createDTO);

        assertThat(result)
                .isNotNull()
                .extracting(ArtifactDTO::getName, ArtifactDTO::getRarity, ArtifactDTO::getIsActive)
                .containsExactly("Интеграционный Тест Артефакт", Artifact.ArtifactRarity.EPIC, true);

        assertThat(result.getId()).isNotNull();

        // Проверяем что артефакт сохранен в базе данных
        List<Artifact> artifactsInDb = artifactRepository.findAll();
        assertThat(artifactsInDb).hasSize(1);

        Artifact artifactInDb = artifactsInDb.get(0);
        assertThat(artifactInDb.getName()).isEqualTo("Интеграционный Тест Артефакт");
        assertThat(artifactInDb.getRarity()).isEqualTo(Artifact.ArtifactRarity.EPIC);
        assertThat(artifactInDb.getIsActive()).isTrue();
    }

    @Test
    @DisplayName("должен возвращать все артефакты из базы данных")
    void shouldReturnAllArtifactsFromDatabase() {
        // Создаем тестовые артефакты
        Artifact artifact1 = Artifact.builder()
                .name("Артефакт 1")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(true)
                .build();

        Artifact artifact2 = Artifact.builder()
                .name("Артефакт 2")
                .rarity(Artifact.ArtifactRarity.RARE)
                .isActive(false)
                .build();

        artifactRepository.save(artifact1);
        artifactRepository.save(artifact2);

        List<ArtifactDTO> result = artifactService.getAllArtifacts();

        assertThat(result).hasSize(2);
        assertThat(result)
                .extracting(ArtifactDTO::getName)
                .containsExactlyInAnyOrder("Артефакт 1", "Артефакт 2");
    }

    @Test
    @DisplayName("должен обновлять артефакт в базе данных")
    void shouldUpdateArtifactInDatabase() {
        // Создаем артефакт
        Artifact artifact = Artifact.builder()
                .name("Оригинальное Название")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(true)
                .build();

        Artifact savedArtifact = artifactRepository.save(artifact);

        // Обновляем артефакт
        var updateDTO = new com.example.alabuga.dto.ArtifactUpdateDTO();
        updateDTO.setName("Обновленное Название");
        updateDTO.setRarity(Artifact.ArtifactRarity.LEGENDARY);

        ArtifactDTO result = artifactService.updateArtifact(savedArtifact.getId(), updateDTO);

        assertThat(result)
                .isNotNull()
                .extracting(ArtifactDTO::getName, ArtifactDTO::getRarity)
                .containsExactly("Обновленное Название", Artifact.ArtifactRarity.LEGENDARY);

        // Проверяем обновление в базе данных
        Artifact updatedInDb = artifactRepository.findById(savedArtifact.getId()).orElseThrow();
        assertThat(updatedInDb.getName()).isEqualTo("Обновленное Название");
        assertThat(updatedInDb.getRarity()).isEqualTo(Artifact.ArtifactRarity.LEGENDARY);
    }

    @Test
    @DisplayName("должен искать артефакты по имени в базе данных")
    void shouldSearchArtifactsByNameInDatabase() {
        // Создаем тестовые артефакты
        Artifact swordArtifact = Artifact.builder()
                .name("Меч Воина")
                .rarity(Artifact.ArtifactRarity.RARE)
                .isActive(true)
                .build();

        Artifact shieldArtifact = Artifact.builder()
                .name("Щит Защитника")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(true)
                .build();

        artifactRepository.save(swordArtifact);
        artifactRepository.save(shieldArtifact);

        // Ищем артефакты по имени
        List<ArtifactDTO> swordResults = artifactService.searchArtifactsByName("меч");
        List<ArtifactDTO> shieldResults = artifactService.searchArtifactsByName("щит");

        assertThat(swordResults).hasSize(1);
        assertThat(swordResults.get(0).getName()).isEqualTo("Меч Воина");

        assertThat(shieldResults).hasSize(1);
        assertThat(shieldResults.get(0).getName()).isEqualTo("Щит Защитника");
    }
}
