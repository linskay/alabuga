package com.example.alabuga.controller;

import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.service.ArtifactService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Тесты обработки ошибок в ArtifactController")
class ArtifactControllerExceptionTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ArtifactService artifactService;

    @Test
    @DisplayName("должен возвращать 404 при несуществующем артефакте")
    void shouldReturn404WhenArtifactNotFound() throws Exception {
        when(artifactService.getArtifactById(999L))
                .thenThrow(new ResourceNotFoundException("Артефакт", 999L));

        mockMvc.perform(get("/api/artifacts/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("должен возвращать 400 при неверной редкости артефакта")
    void shouldReturn400WhenInvalidRarity() throws Exception {
        when(artifactService.getArtifactsByRarity("неверная"))
                .thenThrow(new IllegalArgumentException("Неверная редкость артефакта: неверная"));

        mockMvc.perform(get("/api/artifacts/rarity/неверная"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("должен возвращать 500 при внутренней ошибке сервиса")
    void shouldReturn500WhenInternalError() throws Exception {
        when(artifactService.getAllArtifacts())
                .thenThrow(new RuntimeException("Ошибка базы данных"));

        mockMvc.perform(get("/api/artifacts"))
                .andExpect(status().isInternalServerError());
    }
}
