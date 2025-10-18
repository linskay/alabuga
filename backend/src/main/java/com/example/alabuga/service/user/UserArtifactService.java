package com.example.alabuga.service.user;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserArtifact;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.ArtifactMapper;
import com.example.alabuga.mapper.UserArtifactMapper;
import com.example.alabuga.repository.ArtifactRepository;
import com.example.alabuga.repository.UserArtifactRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Сервис для управления артефактами пользователей
 * Отвечает за инвентарь и экипировку артефактов
 */
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserArtifactService {

    private final UserRepository userRepository;
    private final ArtifactRepository artifactRepository;
    private final UserArtifactRepository userArtifactRepository;
    private final ArtifactMapper artifactMapper;
    private final UserArtifactMapper userArtifactMapper;

    // ========== ARTIFACT OPERATIONS ==========

    public List<ArtifactDTO> getAllAvailableArtifacts() {
        List<Artifact> artifacts = artifactRepository.findByIsActive(true);
        return artifactMapper.toDTOList(artifacts);
    }

    // ========== USER ARTIFACT MANAGEMENT ==========
    
    public List<UserArtifactDTO> getUserArtifacts(Long userId) {
        List<UserArtifact> userArtifacts = userArtifactRepository.findByUserId(userId);
        return userArtifactMapper.toDTOList(userArtifacts);
    }
    
    public List<UserArtifactDTO> getOtherUserArtifacts(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        List<UserArtifact> userArtifacts = userArtifactRepository.findByUserId(userId);
        return userArtifactMapper.toDTOList(userArtifacts);
    }
    
    @Transactional
    public UserArtifactDTO assignArtifactToUser(Long userId, Long artifactId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        Artifact artifact = artifactRepository.findById(artifactId)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", artifactId));
        
        if (userArtifactRepository.findByUserIdAndArtifactId(userId, artifactId) != null) {
            throw new BusinessLogicException("Пользователь уже имеет этот артефакт");
        }
        
        UserArtifact userArtifact = UserArtifact.builder()
                .user(user)
                .artifact(artifact)
                .isEquipped(false)
                .build();
        
        UserArtifact savedUserArtifact = userArtifactRepository.save(userArtifact);
        return userArtifactMapper.toDTO(savedUserArtifact);
    }
    
    @Transactional
    public void removeArtifactFromUser(Long userId, Long artifactId) {
        UserArtifact userArtifact = userArtifactRepository.findByUserIdAndArtifactId(userId, artifactId);
        if (userArtifact == null) {
            throw new ResourceNotFoundException("Артефакт пользователя", artifactId);
        }
        
        userArtifactRepository.delete(userArtifact);
    }
    
    @Transactional
    public UserArtifactDTO equipArtifact(Long userId, Long artifactId) {
        UserArtifact userArtifact = userArtifactRepository.findByUserIdAndArtifactId(userId, artifactId);
        if (userArtifact == null) {
            throw new BusinessLogicException("У пользователя нет этого артефакта");
        }

        // Проверяем лимит экипированных артефактов
        long equippedCount = userArtifactRepository.countEquippedArtifactsByUserId(userId);
        if (!userArtifact.getIsEquipped() && equippedCount >= 3) {
            throw new BusinessLogicException("Можно экипировать максимум 3 артефакта");
        }

        userArtifact.setIsEquipped(!userArtifact.getIsEquipped());
        UserArtifact saved = userArtifactRepository.save(userArtifact);
        return userArtifactMapper.toDTO(saved);
    }

    @Transactional
    public UserArtifactDTO unequipArtifact(Long userId, Long artifactId) {
        UserArtifact userArtifact = userArtifactRepository.findByUserIdAndArtifactId(userId, artifactId);
        if (userArtifact == null) {
            throw new BusinessLogicException("У пользователя нет этого артефакта");
        }

        userArtifact.setIsEquipped(false);
        UserArtifact saved = userArtifactRepository.save(userArtifact);
        return userArtifactMapper.toDTO(saved);
    }
}
