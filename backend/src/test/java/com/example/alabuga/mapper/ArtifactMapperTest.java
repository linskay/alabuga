package com.example.alabuga.mapper;

import com.example.alabuga.dto.ArtifactCreateDTO;
import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.ArtifactUpdateDTO;
import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.UserArtifact;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тесты ArtifactMapper")
class ArtifactMapperTest {

    private final ArtifactMapper mapper = new ArtifactMapper();

    @Test
    @DisplayName("должен корректно преобразовывать Artifact в ArtifactDTO")
    void shouldConvertArtifactToDTO() {
        // given
        Artifact artifact = Artifact.builder()
                .id(1L)
                .name("Меч Кодера")
                .imageUrl("https://example.com/sword.jpg")
                .rarity(Artifact.ArtifactRarity.LEGENDARY)
                .isActive(true)
                .build();

        // when
        ArtifactDTO dto = mapper.toDTO(artifact);

        // then
        assertThat(dto)
                .isNotNull()
                .extracting(ArtifactDTO::getId, ArtifactDTO::getName, ArtifactDTO::getImageUrl, ArtifactDTO::getRarity, ArtifactDTO::getIsActive)
                .containsExactly(1L, "Меч Кодера", "https://example.com/sword.jpg", Artifact.ArtifactRarity.LEGENDARY, true);
    }

    @Test
    @DisplayName("должен возвращать null при преобразовании null Artifact в DTO")
    void shouldReturnNullWhenConvertingNullArtifactToDTO() {
        // when
        ArtifactDTO dto = mapper.toDTO((Artifact) null);

        // then
        assertThat(dto).isNull();
    }

    @Test
    @DisplayName("должен корректно преобразовывать UserArtifact в UserArtifactDTO")
    void shouldConvertUserArtifactToDTO() {
        // given
        Artifact artifact = Artifact.builder()
                .id(1L)
                .name("Щит Разработчика")
                .imageUrl("https://example.com/shield.jpg")
                .rarity(Artifact.ArtifactRarity.EPIC)
                .isActive(true)
                .build();

        UserArtifact userArtifact = UserArtifact.builder()
                .artifact(artifact)
                .isEquipped(true)
                .acquiredAt(LocalDateTime.of(2023, 12, 1, 10, 30))
                .build();

        // when
        UserArtifactDTO dto = mapper.toDTO(userArtifact);

        // then
        assertThat(dto)
                .isNotNull()
                .extracting(UserArtifactDTO::getId, UserArtifactDTO::getName, UserArtifactDTO::getImageUrl,
                        UserArtifactDTO::getRarity, UserArtifactDTO::getIsEquipped, UserArtifactDTO::getAcquiredAt)
                .containsExactly(1L, "Щит Разработчика", "https://example.com/shield.jpg",
                        Artifact.ArtifactRarity.EPIC, true, "2023-12-01T10:30");
    }

    @Test
    @DisplayName("должен корректно преобразовывать список Artifact в список DTO")
    void shouldConvertArtifactListToDTOList() {
        // given
        List<Artifact> artifacts = List.of(
                Artifact.builder().id(1L).name("Артефакт 1").rarity(Artifact.ArtifactRarity.COMMON).isActive(true).build(),
                Artifact.builder().id(2L).name("Артефакт 2").rarity(Artifact.ArtifactRarity.RARE).isActive(false).build()
        );

        // when
        List<ArtifactDTO> dtoList = mapper.toDTOList(artifacts);

        // then
        assertThat(dtoList)
                .isNotNull()
                .hasSize(2)
                .extracting(ArtifactDTO::getId, ArtifactDTO::getName, ArtifactDTO::getRarity, ArtifactDTO::getIsActive)
                .containsExactly(
                        tuple(1L, "Артефакт 1", Artifact.ArtifactRarity.COMMON, true),
                        tuple(2L, "Артефакт 2", Artifact.ArtifactRarity.RARE, false)
                );
    }

    @Test
    @DisplayName("должен возвращать null при преобразовании null списка Artifact в список DTO")
    void shouldReturnNullWhenConvertingNullArtifactListToDTOList() {
        // when
        List<ArtifactDTO> dtoList = mapper.toDTOList(null);

        // then
        assertThat(dtoList).isNull();
    }

    @Test
    @DisplayName("должен корректно преобразовывать ArtifactCreateDTO в Artifact")
    void shouldConvertCreateDTOToEntity() {
        // given
        ArtifactCreateDTO dto = ArtifactCreateDTO.builder()
                .name("Новый Артефакт")
                .imageUrl("https://example.com/new.jpg")
                .rarity(Artifact.ArtifactRarity.EPIC)
                .isActive(true)
                .build();

        // when
        Artifact entity = mapper.toEntity(dto);

        // then
        assertThat(entity)
                .isNotNull()
                .extracting(Artifact::getName, Artifact::getImageUrl, Artifact::getRarity, Artifact::getIsActive)
                .containsExactly("Новый Артефакт", "https://example.com/new.jpg", Artifact.ArtifactRarity.EPIC, true);

        assertThat(entity.getId()).isNull(); // ID генерируется базой данных
    }

    @Test
    @DisplayName("должен возвращать null при преобразовании null ArtifactCreateDTO в Entity")
    void shouldReturnNullWhenConvertingNullCreateDTOToEntity() {
        // when
        Artifact entity = mapper.toEntity(null);

        // then
        assertThat(entity).isNull();
    }

    @Test
    @DisplayName("должен корректно обновлять Artifact из ArtifactUpdateDTO")
    void shouldUpdateEntityFromDTO() {
        // given
        Artifact artifact = Artifact.builder()
                .id(1L)
                .name("Старое Название")
                .imageUrl("https://example.com/old.jpg")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(false)
                .build();

        ArtifactUpdateDTO updateDTO = ArtifactUpdateDTO.builder()
                .name("Новое Название")
                .rarity(Artifact.ArtifactRarity.LEGENDARY)
                .isActive(true)
                .build();

        // when
        mapper.updateEntity(artifact, updateDTO);

        // then
        assertThat(artifact)
                .extracting(Artifact::getId, Artifact::getName, Artifact::getRarity, Artifact::getIsActive)
                .containsExactly(1L, "Новое Название", Artifact.ArtifactRarity.LEGENDARY, true);

        // imageUrl не должен измениться, так как не был указан в updateDTO
        assertThat(artifact.getImageUrl()).isEqualTo("https://example.com/old.jpg");
    }

    @Test
    @DisplayName("должен корректно обрабатывать null значения при обновлении Entity")
    void shouldHandleNullValuesWhenUpdatingEntity() {
        // given
        Artifact artifact = Artifact.builder()
                .id(1L)
                .name("Текущее Название")
                .imageUrl("https://example.com/current.jpg")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(true)
                .build();

        ArtifactUpdateDTO updateDTO = ArtifactUpdateDTO.builder()
                .name(null)
                .imageUrl(null)
                .rarity(null)
                .isActive(null)
                .build();

        // when
        mapper.updateEntity(artifact, updateDTO);

        // then
        // Значения не должны измениться при передаче null
        assertThat(artifact)
                .extracting(Artifact::getName, Artifact::getImageUrl, Artifact::getRarity, Artifact::getIsActive)
                .containsExactly("Текущее Название", "https://example.com/current.jpg", Artifact.ArtifactRarity.COMMON, true);
    }

    @Test
    @DisplayName("должен корректно обрабатывать null Entity при обновлении")
    void shouldHandleNullEntityWhenUpdating() {
        // given
        ArtifactUpdateDTO updateDTO = ArtifactUpdateDTO.builder()
                .name("Новое Название")
                .build();

        // when/then - не должен возникать исключений
        assertThat(mapper).isNotNull();
        // Просто проверяем, что метод не падает при null entity
        mapper.updateEntity(null, updateDTO);
    }
}
