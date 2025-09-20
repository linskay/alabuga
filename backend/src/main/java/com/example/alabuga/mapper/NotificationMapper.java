package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.NotificationCreateDTO;
import com.example.alabuga.dto.NotificationDTO;
import com.example.alabuga.dto.NotificationUpdateDTO;
import com.example.alabuga.entity.Notification;
import com.example.alabuga.entity.Notification.NotificationType;

@Component
public class NotificationMapper {
    
    public NotificationDTO toDTO(Notification notification) {
        if (notification == null) {
            return null;
        }
        
        // Получаем отображаемое название типа
        String typeDisplayName = getNotificationTypeDisplayName(notification.getNotificationType());
        
        return NotificationDTO.builder()
                .id(notification.getId())
                .userId(notification.getUser() != null ? notification.getUser().getId() : null)
                .title(notification.getTitle())
                .content(notification.getContent())
                .notificationType(notification.getNotificationType())
                .notificationTypeDisplayName(typeDisplayName)
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .metadata(notification.getMetadata())
                .build();
    }
    
    public List<NotificationDTO> toDTOList(List<Notification> notifications) {
        if (notifications == null) {
            return null;
        }
        
        return notifications.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public Notification toEntity(NotificationCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        return Notification.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .notificationType(dto.getNotificationType())
                .metadata(dto.getMetadata())
                .build();
    }

    public void updateEntity(Notification notification, NotificationUpdateDTO dto) {
        if (notification == null || dto == null) {
            return;
        }

        if (dto.getTitle() != null) {
            notification.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null) {
            notification.setContent(dto.getContent());
        }
        if (dto.getIsRead() != null) {
            notification.setIsRead(dto.getIsRead());
        }
        if (dto.getMetadata() != null) {
            notification.setMetadata(dto.getMetadata());
        }
    }
    
    private String getNotificationTypeDisplayName(String notificationType) {
        if (notificationType == null) {
            return "Неизвестный тип";
        }
        
        try {
            NotificationType type = NotificationType.valueOf(notificationType);
            return type.getDisplayName();
        } catch (IllegalArgumentException e) {
            return "Неизвестный тип";
        }
    }
}
