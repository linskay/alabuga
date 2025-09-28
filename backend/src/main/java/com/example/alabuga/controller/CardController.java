package com.example.alabuga.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.alabuga.dto.CardDTO;
import com.example.alabuga.dto.UserCardDTO;
import com.example.alabuga.entity.Card;
import com.example.alabuga.entity.UserCard;
import com.example.alabuga.service.CardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/cards")
@Tag(name = "Карты", description = "API для работы с коллекционными картами")
@Slf4j
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping("/available/{userId}")
    @Operation(summary = "Получить доступные карты для пользователя",
               description = "Возвращает список карт, которые пользователь может получить")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список доступных карт"),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден")
    })
    public ResponseEntity<List<CardDTO>> getAvailableCards(
            @Parameter(description = "ID пользователя", required = true)
            @PathVariable
            @Positive(message = "ID пользователя должен быть положительным")
            Long userId) {
        try {
            List<Card> cards = cardService.getAvailableCardsForUser(userId);
            List<CardDTO> cardDTOs = cards.stream()
                .map(CardDTO::fromEntity)
                .toList();
            return ResponseEntity.ok(cardDTOs);
        } catch (Exception e) {
            log.error("Ошибка при получении доступных карт для пользователя {}: {}", userId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Получить карты пользователя", 
               description = "Возвращает список карт, которые есть у пользователя")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список карт пользователя"),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден")
    })
    public ResponseEntity<List<UserCardDTO>> getUserCards(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        try {
            List<UserCard> userCards = cardService.getUserCards(userId);
            List<UserCardDTO> userCardDTOs = userCards.stream()
                .map(UserCardDTO::fromEntity)
                .toList();
            return ResponseEntity.ok(userCardDTOs);
        } catch (Exception e) {
            log.error("Ошибка при получении карт пользователя {}: {}", userId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}/series/{seriesName}")
    @Operation(summary = "Получить карты пользователя по серии", 
               description = "Возвращает список карт пользователя из определенной серии")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список карт пользователя по серии"),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден")
    })
    public ResponseEntity<List<UserCardDTO>> getUserCardsBySeries(
            @Parameter(description = "ID пользователя") @PathVariable Long userId,
            @Parameter(description = "Название серии") @PathVariable String seriesName) {
        try {
            List<UserCard> userCards = cardService.getUserCardsBySeries(userId, seriesName);
            List<UserCardDTO> userCardDTOs = userCards.stream()
                .map(UserCardDTO::fromEntity)
                .toList();
            return ResponseEntity.ok(userCardDTOs);
        } catch (Exception e) {
            log.error("Ошибка при получении карт пользователя {} по серии {}: {}", userId, seriesName, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/check-awards/{userId}")
    @Operation(summary = "Проверить и выдать карты", 
               description = "Проверяет условия и выдает карты пользователю при их выполнении")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Карты проверены и выданы"),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден")
    })
    public ResponseEntity<String> checkAndAwardCards(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        try {
            cardService.checkAndAwardCards(userId);
            return ResponseEntity.ok("Карты проверены и выданы");
        } catch (Exception e) {
            log.error("Ошибка при проверке и выдаче карт пользователю {}: {}", userId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/mark-viewed/{userId}/{cardId}")
    @Operation(summary = "Отметить карту как просмотренную", 
               description = "Убирает статус 'новая' с карты")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Карта отмечена как просмотренная"),
        @ApiResponse(responseCode = "404", description = "Карта не найдена")
    })
    public ResponseEntity<String> markCardAsViewed(
            @Parameter(description = "ID пользователя") @PathVariable Long userId,
            @Parameter(description = "ID карты") @PathVariable Long cardId) {
        try {
            cardService.markCardAsViewed(userId, cardId);
            return ResponseEntity.ok("Карта отмечена как просмотренная");
        } catch (Exception e) {
            log.error("Ошибка при отметке карты {} как просмотренной для пользователя {}: {}", cardId, userId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/series")
    @Operation(summary = "Получить все серии карт", 
               description = "Возвращает список всех серий карт")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список серий карт")
    })
    public ResponseEntity<List<String>> getAllSeries() {
        try {
            List<String> series = cardService.getAllSeries();
            return ResponseEntity.ok(series);
        } catch (Exception e) {
            log.error("Ошибка при получении серий карт: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/series/{seriesName}")
    @Operation(summary = "Получить карты по серии", 
               description = "Возвращает список карт из определенной серии")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список карт серии"),
        @ApiResponse(responseCode = "404", description = "Серия не найдена")
    })
    public ResponseEntity<List<CardDTO>> getCardsBySeries(
            @Parameter(description = "Название серии") @PathVariable String seriesName) {
        try {
            List<Card> cards = cardService.getCardsBySeries(seriesName);
            List<CardDTO> cardDTOs = cards.stream()
                .map(CardDTO::fromEntity)
                .toList();
            return ResponseEntity.ok(cardDTOs);
        } catch (Exception e) {
            log.error("Ошибка при получении карт серии {}: {}", seriesName, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/debug/all-cards")
    @Operation(summary = "Получить все карты (для отладки)", 
               description = "Возвращает все карты в системе для отладки")
    public ResponseEntity<List<CardDTO>> getAllCards() {
        try {
            List<Card> cards = cardService.getAllSeries().stream()
                .flatMap(series -> cardService.getCardsBySeries(series).stream())
                .toList();
            List<CardDTO> cardDTOs = cards.stream()
                .map(CardDTO::fromEntity)
                .toList();
            return ResponseEntity.ok(cardDTOs);
        } catch (Exception e) {
            log.error("Ошибка при получении всех карт: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
