package com.example.alabuga.service.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.NotificationCreateDTO;
import com.example.alabuga.entity.Notification;
import com.example.alabuga.entity.User;
import com.example.alabuga.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

/**
 * Сервис для создания пользовательских уведомлений
 * Отвечает за уведомления, связанные с действиями пользователей
 */
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserNotificationService {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @Transactional
    public void createBranchSelectionNotification(User user, int newRank) {
        String title = "СИСТЕМНЫЙ ЖУРНАЛ: ВЫБОР СПЕЦИАЛИЗАЦИИ";
        String content = generateBranchSelectionContent(newRank);
        String metadata = createBranchSelectionMetadata(newRank);

        NotificationCreateDTO dto = NotificationCreateDTO.builder()
                .userId(user.getId())
                .title(title)
                .content(content)
                .notificationType(Notification.NotificationType.SYSTEM_MESSAGE.getCode())
                .metadata(metadata)
                .build();

        notificationService.createNotification(dto);
    }

    private String generateBranchSelectionContent(int rank) {
        return switch (rank) {
            case 2 -> """
                    📨 Сообщение 2.0: Специализация Навигатора
                    
                    // АКТИВАЦИЯ ПРОТОКОЛА СПЕЦИАЛИЗАЦИИ //
                    Поздравляем с достижением ранга Навигатора!
                    
                    Теперь вам доступны специализированные ветки миссий:
                    • Кольцо Посланцев (техническая специализация)
                    • Академия Звёздного Флота (исследовательская специализация)
                    • Пояс Испытаний (лидерская специализация)
                    
                    Выберите ветку миссий в разделе "Миссии" для продолжения развития.
                    """;
            case 3 -> """
                    📨 Сообщение 3.0: Специализация Аналитика
                    
                    // АКТИВАЦИЯ ПРОТОКОЛА СПЕЦИАЛИЗАЦИИ //
                    Поздравляем с достижением ранга Аналитика!
                    
                    Теперь вам доступны специализированные ветки миссий:
                    • Кольцо Посланцев (техническая специализация)
                    • Академия Звёздного Флота (исследовательская специализация)
                    • Пояс Испытаний (лидерская специализация)
                    
                    Выберите ветку миссий в разделе "Миссии" для продолжения развития.
                    """;
            case 4 -> """
                    📨 Сообщение 4.0: Специализация Архитектора
                    
                    // АКТИВАЦИЯ ПРОТОКОЛА СПЕЦИАЛИЗАЦИИ //
                    Поздравляем с достижением ранга Архитектора!
                    
                    Теперь вам доступны специализированные ветки миссий:
                    • Кольцо Посланцев (техническая специализация)
                    • Академия Звёздного Флота (исследовательская специализация)
                    • Пояс Испытаний (лидерская специализация)
                    
                    Выберите ветку миссий в разделе "Миссии" для продолжения развития.
                    """;
            default -> "Неизвестный ранг: " + rank;
        };
    }

    private String createBranchSelectionMetadata(int rank) {
        try {
            return objectMapper.writeValueAsString(new BranchSelectionMetadata(rank));
        } catch (Exception e) {
            // Если сериализация не удалась, возвращаем простую строку
            return "{\"rank\": " + rank + "}";
        }
    }

    private record BranchSelectionMetadata(int rank) {
    }
}