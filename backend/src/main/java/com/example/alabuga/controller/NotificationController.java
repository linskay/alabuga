package com.example.alabuga.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.alabuga.dto.NotificationCreateDTO;
import com.example.alabuga.dto.NotificationDTO;
import com.example.alabuga.dto.NotificationUpdateDTO;
import com.example.alabuga.service.NotificationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notification Management", description = "API для управления системными уведомлениями")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Получить все уведомления пользователя")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread")
    @Operation(summary = "Получить непрочитанные уведомления пользователя")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить уведомление по ID")
    public ResponseEntity<NotificationDTO> getNotificationById(
            @Parameter(description = "ID уведомления") @PathVariable Long id) {
        NotificationDTO notification = notificationService.getNotificationById(id);
        return ResponseEntity.ok(notification);
    }

    @PostMapping
    @Operation(summary = "Создать новое уведомление")
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationCreateDTO dto) {
        NotificationDTO notification = notificationService.createNotification(dto);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить уведомление")
    public ResponseEntity<NotificationDTO> updateNotification(
            @Parameter(description = "ID уведомления") @PathVariable Long id,
            @RequestBody NotificationUpdateDTO dto) {
        NotificationDTO notification = notificationService.updateNotification(id, dto);
        return ResponseEntity.ok(notification);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить уведомление")
    public ResponseEntity<Void> deleteNotification(
            @Parameter(description = "ID уведомления") @PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Отметить уведомление как прочитанное")
    public ResponseEntity<NotificationDTO> markAsRead(
            @Parameter(description = "ID уведомления") @PathVariable Long id) {
        NotificationDTO notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/user/{userId}/read-all")
    @Operation(summary = "Отметить все уведомления пользователя как прочитанные")
    public ResponseEntity<Void> markAllAsRead(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/unread-count")
    @Operation(summary = "Получить количество непрочитанных уведомлений")
    public ResponseEntity<Long> getUnreadCount(
            @Parameter(description = "ID пользователя") @PathVariable Long userId) {
        Long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

}
