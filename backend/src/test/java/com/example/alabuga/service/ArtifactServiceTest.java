package com.example.alabuga.service;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.alabuga.dto.ArtifactCreateDTO;
import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.ArtifactUpdateDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.User;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.ArtifactMapper;
import com.example.alabuga.repository.ArtifactRepository;
import com.example.alabuga.repository.UserArtifactRepository;
import com.example.alabuga.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тесты ArtifactService")
class ArtifactServiceTest {

    @Mock
    private ArtifactRepository artifactRepository;

    @Mock
    private UserArtifactRepository userArtifactRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ArtifactMapper artifactMapper;

    @InjectMocks
    private ArtifactService artifactService;

    private Artifact testArtifact;
    private ArtifactDTO testArtifactDTO;
    private User testUser;

    @BeforeEach
    void setUp() {
        testArtifact = Artifact.builder()
                .id(1L)
                .name("Тестовый Артефакт")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(true)
                .build();

        testArtifactDTO = ArtifactDTO.builder()
                .id(1L)
                .name("Тестовый Артефакт")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(true)
                .build();

        testUser = User.builder()
                .id(1L)
                .login("testuser")
                .build();
    }

    @Test
    @DisplayName("должен возвращать все артефакты")
    void shouldReturnAllArtifacts() {
        List<Artifact> artifacts = List.of(testArtifact);
        when(artifactRepository.findAll()).thenReturn(artifacts);
        when(artifactMapper.toDTOList(artifacts)).thenReturn(List.of(testArtifactDTO));

        List<ArtifactDTO> result = artifactService.getAllArtifacts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(testArtifactDTO);
        verify(artifactRepository).findAll();
        verify(artifactMapper).toDTOList(artifacts);
    }

    @Test
    @DisplayName("должен возвращать активные артефакты")
    void shouldReturnActiveArtifacts() {
        List<Artifact> artifacts = List.of(testArtifact);
        when(artifactRepository.findByIsActive(true)).thenReturn(artifacts);
        when(artifactMapper.toDTOList(artifacts)).thenReturn(List.of(testArtifactDTO));

        List<ArtifactDTO> result = artifactService.getActiveArtifacts();

        assertThat(result).hasSize(1);
        verify(artifactRepository).findByIsActive(true);
    }

    @Test
    @DisplayName("должен возвращать артефакт по ID")
    void shouldReturnArtifactById() {
        when(artifactRepository.findById(1L)).thenReturn(Optional.of(testArtifact));
        when(artifactMapper.toDTO(testArtifact)).thenReturn(testArtifactDTO);

        ArtifactDTO result = artifactService.getArtifactById(1L);

        assertThat(result).isEqualTo(testArtifactDTO);
        verify(artifactRepository).findById(1L);
    }

    @Test
    @DisplayName("должен выбрасывать исключение при несуществующем артефакте")
    void shouldThrowExceptionWhenArtifactNotFound() {
        when(artifactRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> artifactService.getArtifactById(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("должен возвращать артефакты по редкости")
    void shouldReturnArtifactsByRarity() {
        List<Artifact> artifacts = List.of(testArtifact);
        when(artifactRepository.findByRarity(Artifact.ArtifactRarity.COMMON)).thenReturn(artifacts);
        when(artifactMapper.toDTOList(artifacts)).thenReturn(List.of(testArtifactDTO));

        List<ArtifactDTO> result = artifactService.getArtifactsByRarity("common");

        assertThat(result).hasSize(1);
        verify(artifactRepository).findByRarity(Artifact.ArtifactRarity.COMMON);
    }

    @Test
    @DisplayName("должен выбрасывать исключение при неверной редкости")
    void shouldThrowExceptionForInvalidRarity() {
        assertThatThrownBy(() -> artifactService.getArtifactsByRarity("invalid"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Неверная редкость артефакта");
    }

    @Test
    @DisplayName("должен искать артефакты по имени")
    void shouldSearchArtifactsByName() {
        List<Artifact> artifacts = List.of(testArtifact);
        when(artifactRepository.findByNameContainingIgnoreCase("тест")).thenReturn(artifacts);
        when(artifactMapper.toDTOList(artifacts)).thenReturn(List.of(testArtifactDTO));

        List<ArtifactDTO> result = artifactService.searchArtifactsByName("тест");

        assertThat(result).hasSize(1);
        verify(artifactRepository).findByNameContainingIgnoreCase("тест");
    }

    @Test
    @DisplayName("должен создавать артефакт")
    void shouldCreateArtifact() {
        ArtifactCreateDTO createDTO = ArtifactCreateDTO.builder()
                .name("Новый Артефакт")
                .rarity(Artifact.ArtifactRarity.RARE)
                .isActive(true)
                .build();

        Artifact newArtifact = Artifact.builder()
                .id(2L)
                .name("Новый Артефакт")
                .rarity(Artifact.ArtifactRarity.RARE)
                .isActive(true)
                .build();

        ArtifactDTO newArtifactDTO = ArtifactDTO.builder()
                .id(2L)
                .name("Новый Артефакт")
                .rarity(Artifact.ArtifactRarity.RARE)
                .isActive(true)
                .build();

        when(artifactMapper.toEntity(createDTO)).thenReturn(newArtifact);
        when(artifactRepository.save(newArtifact)).thenReturn(newArtifact);
        when(artifactMapper.toDTO(newArtifact)).thenReturn(newArtifactDTO);

        ArtifactDTO result = artifactService.createArtifact(createDTO);

        assertThat(result).isEqualTo(newArtifactDTO);
        verify(artifactMapper).toEntity(createDTO);
        verify(artifactRepository).save(newArtifact);
    }

    @Test
    @DisplayName("должен обновлять артефакт")
    void shouldUpdateArtifact() {
        ArtifactUpdateDTO updateDTO = ArtifactUpdateDTO.builder()
                .name("Обновленное Название")
                .build();

        Artifact updatedArtifact = Artifact.builder()
                .id(1L)
                .name("Обновленное Название")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(true)
                .build();

        ArtifactDTO updatedArtifactDTO = ArtifactDTO.builder()
                .id(1L)
                .name("Обновленное Название")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(true)
                .build();

        when(artifactRepository.findById(1L)).thenReturn(Optional.of(testArtifact));
        when(artifactRepository.save(any(Artifact.class))).thenReturn(updatedArtifact);
        when(artifactMapper.toDTO(updatedArtifact)).thenReturn(updatedArtifactDTO);

        ArtifactDTO result = artifactService.updateArtifact(1L, updateDTO);

        assertThat(result).isEqualTo(updatedArtifactDTO);
        verify(artifactRepository).findById(1L);
        verify(artifactMapper).updateEntity(any(Artifact.class), any(ArtifactUpdateDTO.class));
    }

    @Test
    @DisplayName("должен удалять артефакт")
    void shouldDeleteArtifact() {
        when(artifactRepository.findById(1L)).thenReturn(Optional.of(testArtifact));
        when(artifactRepository.save(any(Artifact.class))).thenAnswer(invocation -> invocation.getArgument(0));

        artifactService.deleteArtifact(1L);

        verify(artifactRepository).findById(1L);
        verify(artifactRepository).save(testArtifact);
        assertThat(testArtifact.getIsActive()).isFalse();
    }

    @Test
    @DisplayName("должен переключать статус артефакта")
    void shouldToggleArtifactStatus() {
        Artifact toggledArtifact = Artifact.builder()
                .id(1L)
                .name("Тестовый Артефакт")
                .rarity(Artifact.ArtifactRarity.COMMON)
                .isActive(false)
                .build();

        when(artifactRepository.findById(1L)).thenReturn(Optional.of(testArtifact));
        when(artifactRepository.save(any(Artifact.class))).thenReturn(toggledArtifact);
        when(artifactMapper.toDTO(toggledArtifact)).thenReturn(
                ArtifactDTO.builder()
                        .id(1L)
                        .name("Тестовый Артефакт")
                        .rarity(Artifact.ArtifactRarity.COMMON)
                        .isActive(false)
                        .build()
        );

        ArtifactDTO result = artifactService.toggleArtifactStatus(1L);

        verify(artifactRepository).findById(1L);
        verify(artifactRepository).save(testArtifact);
        assertThat(result.getIsActive()).isFalse();
    }

}
