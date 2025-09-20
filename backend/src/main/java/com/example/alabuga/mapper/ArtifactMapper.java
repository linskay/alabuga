package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.UserArtifact;

@Component
public class ArtifactMapper {
    
    public ArtifactDTO toDTO(Artifact artifact) {
        if (artifact == null) {
            return null;
        }
        
        return ArtifactDTO.builder()
                .id(artifact.getId())
                .name(artifact.getName())
                .description(artifact.getDescription())
                .rarity(artifact.getRarity())
                .powerLevel(artifact.getPowerLevel())
                .isActive(artifact.getIsActive())
                .build();
    }
    
    public UserArtifactDTO toDTO(UserArtifact userArtifact) {
        if (userArtifact == null) {
            return null;
        }
        
        return UserArtifactDTO.builder()
                .id(userArtifact.getId())
                .userId(userArtifact.getUser() != null ? userArtifact.getUser().getId() : null)
                .artifactId(userArtifact.getArtifact() != null ? userArtifact.getArtifact().getId() : null)
                .artifactName(userArtifact.getArtifact() != null ? userArtifact.getArtifact().getName() : null)
                .artifactDescription(userArtifact.getArtifact() != null ? userArtifact.getArtifact().getDescription() : null)
                .artifactRarity(userArtifact.getArtifact() != null ? userArtifact.getArtifact().getRarity().toString() : null)
                .isEquipped(userArtifact.getIsEquipped())
                .isActive(true) // UserArtifact не имеет поля isActive, используем true по умолчанию
                .build();
    }
    
    public List<ArtifactDTO> toDTOList(List<Artifact> artifacts) {
        if (artifacts == null) {
            return null;
        }
        
        return artifacts.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserArtifactDTO> toUserArtifactDTOList(List<UserArtifact> userArtifacts) {
        if (userArtifacts == null) {
            return null;
        }
        
        return userArtifacts.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
