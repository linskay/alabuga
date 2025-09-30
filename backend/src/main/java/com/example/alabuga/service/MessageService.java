package com.example.alabuga.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.Mission;
import com.example.alabuga.entity.ShopItem;
import com.example.alabuga.entity.User;
import com.example.alabuga.enums.MessageType;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.repository.ArtifactRepository;
import com.example.alabuga.repository.MissionRepository;
import com.example.alabuga.repository.ShopItemRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final UserRepository userRepository;
    private final MissionRepository missionRepository;
    private final ArtifactRepository artifactRepository;
    private final ShopItemRepository shopItemRepository;
    
    // Подтверждения действий
    public Map<String, String> getDeleteUserMessage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        String message = MessageType.DELETE_USER.getMessage(user.getFirstName() + " " + user.getLastName());
        
        return Map.of(
            "title", MessageType.DELETE_USER.getTitle(),
            "message", message
        );
    }
    
    public Map<String, String> getDeleteArtifactMessage(Long artifactId) {
        Artifact artifact = artifactRepository.findById(artifactId)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", artifactId));
        
        String message = MessageType.DELETE_ARTIFACT.getMessage(artifact.getName());
        
        return Map.of(
            "title", MessageType.DELETE_ARTIFACT.getTitle(),
            "message", message
        );
    }
    
    public Map<String, String> getDeleteMissionMessage(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Миссия", missionId));
        
        String message = MessageType.DELETE_MISSION.getMessage(mission.getName());
        
        return Map.of(
            "title", MessageType.DELETE_MISSION.getTitle(),
            "message", message
        );
    }
    
    public Map<String, String> getCompleteMissionMessage(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Миссия", missionId));
        
        String message = MessageType.COMPLETE_MISSION.getMessage(mission.getName());
        
        return Map.of(
            "title", MessageType.COMPLETE_MISSION.getTitle(),
            "message", message
        );
    }
    
    public Map<String, String> getRemoveMissionMessage(Long userId, Long missionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Миссия", missionId));
        
        String message = MessageType.REMOVE_MISSION.getMessage(
            mission.getName(), 
            user.getFirstName() + " " + user.getLastName()
        );
        
        return Map.of(
            "title", MessageType.REMOVE_MISSION.getTitle(),
            "message", message
        );
    }
    
    public Map<String, String> getTakeMissionMessage(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Миссия", missionId));
        
        String message = MessageType.TAKE_MISSION.getMessage(mission.getName());
        
        return Map.of(
            "title", MessageType.TAKE_MISSION.getTitle(),
            "message", message
        );
    }
    
    // Сообщения покупки
    public Map<String, String> getPurchaseMessage(Long shopItemId) {
        ShopItem shopItem = shopItemRepository.findById(shopItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Товар", shopItemId));
        
        // Определяем тип сообщения по типу товара
        MessageType messageType = getPurchaseMessageType(shopItem);
        String message = messageType.getMessage(shopItem.getName(), String.valueOf(shopItem.getPrice()));
        
        return Map.of(
            "title", messageType.getTitle(),
            "message", message
        );
    }
    
    private MessageType getPurchaseMessageType(ShopItem shopItem) {
        String name = shopItem.getName().toLowerCase();
        String description = shopItem.getDescription() != null ? shopItem.getDescription().toLowerCase() : "";
        
        if (name.contains("чертеж") || description.contains("чертеж")) {
            return MessageType.BLUEPRINT_PURCHASE;
        }
        if (name.contains("кристалл") || name.contains("сплав") || name.contains("процессор") ||
            description.contains("ресурс") || description.contains("материал")) {
            return MessageType.RESOURCE_PURCHASE;
        }
        if (name.contains("модуль") || name.contains("усилитель") || name.contains("защита") ||
            description.contains("улучшение") || description.contains("модернизация")) {
            return MessageType.UPGRADE_PURCHASE;
        }
        if (name.contains("артефакт") || description.contains("артефакт") || description.contains("древний")) {
            return MessageType.ARTIFACT_PURCHASE;
        }
        if (name.contains("карта") || description.contains("карта") || description.contains("координат")) {
            return MessageType.MAP_PURCHASE;
        }
        
        return MessageType.DEFAULT_PURCHASE;
    }
    
    // Уведомления об успехе
    public Map<String, String> getSuccessNotification(MessageType type, String... params) {
        String title = type.getTitle();
        String message = type.getMessage(params);
        return Map.of("title", title, "message", message);
    }
    
    // Уведомления об ошибках
    public Map<String, String> getErrorNotification(MessageType type, String... params) {
        String title = type.getTitle();
        String message = type.getMessage(params);
        return Map.of("title", title, "message", message);
    }
    
    // UI тексты
    public Map<String, String> getUITexts() {
        Map<String, String> texts = new HashMap<>();
        texts.put("searchPlaceholder", MessageType.SEARCH_PLACEHOLDER.getTemplate());
        texts.put("userSearchPlaceholder", MessageType.USER_SEARCH_PLACEHOLDER.getTemplate());
        texts.put("missionSearchPlaceholder", MessageType.MISSION_SEARCH_PLACEHOLDER.getTemplate());
        texts.put("shopSearchPlaceholder", MessageType.SHOP_SEARCH_PLACEHOLDER.getTemplate());
        texts.put("artifactSearchPlaceholder", MessageType.ARTIFACT_SEARCH_PLACEHOLDER.getTemplate());
        texts.put("buttonCancel", MessageType.BUTTON_CANCEL.getTemplate());
        texts.put("buttonConfirm", MessageType.BUTTON_CONFIRM.getTemplate());
        texts.put("buttonDelete", MessageType.BUTTON_DELETE.getTemplate());
        texts.put("buttonEdit", MessageType.BUTTON_EDIT.getTemplate());
        texts.put("buttonBuy", MessageType.BUTTON_BUY.getTemplate());
        texts.put("buttonTakeMission", MessageType.BUTTON_TAKE_MISSION.getTemplate());
        return texts;
    }
}
