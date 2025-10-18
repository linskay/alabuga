package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.ArtifactCreateDTO;
import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.ArtifactUpdateDTO;
import com.example.alabuga.entity.Artifact;

@Component
public class ArtifactMapper {
    
    public ArtifactDTO toDTO(Artifact artifact) {
        if (artifact == null) {
            return null;
        }
        
        return ArtifactDTO.builder()
                .id(artifact.getId())
                .name(artifact.getName())
                .imageUrl(artifact.getImageUrl())
                .rarity(artifact.getRarity())
                .isActive(artifact.getIsActive())
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

    public Artifact toEntity(ArtifactCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        return Artifact.builder()
                .name(dto.getName())
                .imageUrl(dto.getImageUrl())
                .rarity(dto.getRarity())
                .isActive(dto.getIsActive())
                .build();
    }

    public void updateEntity(Artifact artifact, ArtifactUpdateDTO dto) {
        if (artifact == null || dto == null) {
            return;
        }

        if (dto.getName() != null) {
            artifact.setName(dto.getName());
        }
        if (dto.getImageUrl() != null) {
            artifact.setImageUrl(dto.getImageUrl());
        }
        if (dto.getRarity() != null) {
            artifact.setRarity(dto.getRarity());
        }
        if (dto.getIsActive() != null) {
            artifact.setIsActive(dto.getIsActive());
        }
    }
}
