package com.example.alabuga.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserArtifact;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.UserArtifactMapper;
import com.example.alabuga.repository.ArtifactRepository;

import com.example.alabuga.repository.UserArtifactRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserArtifactService {
    
    private final UserArtifactRepository userArtifactRepository;
    private final UserRepository userRepository;
    private final ArtifactRepository artifactRepository;
    private final UserArtifactMapper userArtifactMapper;
    private final NotificationService notificationService;
    
    public List<UserArtifactDTO> getUserArtifacts(Long userId) {
        List<UserArtifact> userArtifacts = userArtifactRepository.findByUserId(userId);
        return userArtifactMapper.toDTOList(userArtifacts);
    }
    
    @Transactional
    public UserArtifactDTO equipArtifact(Long userId, Long artifactId) {
        // Проверяем существование пользователя
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        // Проверяем существование артефакта
        artifactRepository.findById(artifactId)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", artifactId));
        
        // Проверяем, есть ли у пользователя этот артефакт
        UserArtifact userArtifact = userArtifactRepository.findByUserIdAndArtifactId(userId, artifactId);
        if (userArtifact == null) {
            throw new BusinessLogicException("У пользователя нет этого артефакта");
        }
        
        // Проверяем лимит экипированных артефактов
        long equippedCount = userArtifactRepository.countEquippedArtifactsByUserId(userId);
        if (!userArtifact.getIsEquipped() && equippedCount >= 3) {
            throw new BusinessLogicException("Можно экипировать максимум 3 артефакта");
        }
        
        // Переключаем состояние экипировки
        userArtifact.setIsEquipped(!userArtifact.getIsEquipped());
        UserArtifact saved = userArtifactRepository.save(userArtifact);
        
        return userArtifactMapper.toDTO(saved);
    }
    
    @Transactional
    public UserArtifactDTO giveArtifactToUser(Long userId, Long artifactId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        Artifact artifact = artifactRepository.findById(artifactId)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", artifactId));
        
        // Проверяем, есть ли уже у пользователя этот артефакт
        if (userArtifactRepository.existsByUserIdAndArtifactId(userId, artifactId)) {
            throw new BusinessLogicException("У пользователя уже есть этот артефакт");
        }
        
        // Создаем новый артефакт для пользователя
        UserArtifact userArtifact = UserArtifact.builder()
                .user(user)
                .artifact(artifact)
                .isEquipped(false)
                .build();
        
        UserArtifact saved = userArtifactRepository.save(userArtifact);
        
        // Создаем уведомление о получении артефакта
        notificationService.createArtifactAcquiredNotification(user, artifact.getName(), artifact.getRarity().getDisplayName());
        
        return userArtifactMapper.toDTO(saved);
    }
}
