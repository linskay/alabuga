package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.entity.UserArtifact;

@Component
public class UserArtifactMapper {
    
    public UserArtifactDTO toDTO(UserArtifact userArtifact) {
        if (userArtifact == null) {
            return null;
        }
        
        if (userArtifact.getArtifact() == null) {
            throw new RuntimeException("UserArtifact.artifact is null for userArtifact id: " + userArtifact.getId());
        }
        
        return UserArtifactDTO.builder()
                .id(userArtifact.getArtifact().getId())
                .name(userArtifact.getArtifact().getName())
                .shortDescription(userArtifact.getArtifact().getShortDescription())
                .imageUrl(userArtifact.getArtifact().getImageUrl())
                .rarity(userArtifact.getArtifact().getRarity())
                .isEquipped(userArtifact.getIsEquipped())
                .acquiredAt(userArtifact.getAcquiredAt() != null ? userArtifact.getAcquiredAt().toString() : null)
                .build();
    }
    
    public List<UserArtifactDTO> toDTOList(List<UserArtifact> userArtifacts) {
        if (userArtifacts == null) {
            return null;
        }
        
        return userArtifacts.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
