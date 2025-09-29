package com.example.alabuga.controller;

import com.example.alabuga.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@Tag(name = "Messages", description = "API для получения всех сообщений приложения")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // Подтверждения действий
    @GetMapping("/delete-user/{userId}")
    @Operation(summary = "Получить сообщение подтверждения удаления пользователя")
    public ResponseEntity<Map<String, String>> getDeleteUserMessage(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        Map<String, String> message = messageService.getDeleteUserMessage(userId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/delete-artifact/{artifactId}")
    @Operation(summary = "Получить сообщение подтверждения удаления артефакта")
    public ResponseEntity<Map<String, String>> getDeleteArtifactMessage(
            @Parameter(description = "ID артефакта") @PathVariable Long artifactId) {
        Map<String, String> message = messageService.getDeleteArtifactMessage(artifactId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/delete-mission/{missionId}")
    @Operation(summary = "Получить сообщение подтверждения удаления миссии")
    public ResponseEntity<Map<String, String>> getDeleteMissionMessage(
            @Parameter(description = "ID миссии") @PathVariable Long missionId) {
        Map<String, String> message = messageService.getDeleteMissionMessage(missionId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/complete-mission/{missionId}")
    @Operation(summary = "Получить сообщение подтверждения выполнения миссии")
    public ResponseEntity<Map<String, String>> getCompleteMissionMessage(
            @Parameter(description = "ID миссии") @PathVariable Long missionId) {
        Map<String, String> message = messageService.getCompleteMissionMessage(missionId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/remove-mission/{userId}/{missionId}")
    @Operation(summary = "Получить сообщение подтверждения удаления миссии у пользователя")
    public ResponseEntity<Map<String, String>> getRemoveMissionMessage(
            @Parameter(description = "ID пользователя") @PathVariable Long userId,
            @Parameter(description = "ID миссии") @PathVariable Long missionId) {
        Map<String, String> message = messageService.getRemoveMissionMessage(userId, missionId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/take-mission/{missionId}")
    @Operation(summary = "Получить сообщение подтверждения принятия миссии")
    public ResponseEntity<Map<String, String>> getTakeMissionMessage(
            @Parameter(description = "ID миссии") @PathVariable Long missionId) {
        Map<String, String> message = messageService.getTakeMissionMessage(missionId);
        return ResponseEntity.ok(message);
    }

    // Сообщения покупки
    @GetMapping("/purchase/{shopItemId}")
    @Operation(summary = "Получить сообщение подтверждения покупки")
    public ResponseEntity<Map<String, String>> getPurchaseMessage(
            @Parameter(description = "ID товара") @PathVariable Long shopItemId) {
        Map<String, String> message = messageService.getPurchaseMessage(shopItemId);
        return ResponseEntity.ok(message);
    }

    // UI тексты
    @GetMapping("/ui-texts")
    @Operation(summary = "Получить все UI тексты приложения")
    public ResponseEntity<Map<String, String>> getUITexts() {
        Map<String, String> texts = messageService.getUITexts();
        return ResponseEntity.ok(texts);
    }
}
