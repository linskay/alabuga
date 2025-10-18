package com.example.alabuga.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.ArtifactCreateDTO;
import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.ArtifactUpdateDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.ArtifactMapper;
import com.example.alabuga.repository.ArtifactRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArtifactService {
    
    private final ArtifactRepository artifactRepository;
    private final ArtifactMapper artifactMapper;
    
    public List<ArtifactDTO> getAllArtifacts() {
        List<Artifact> artifacts = artifactRepository.findAll();
        return artifactMapper.toDTOList(artifacts);
    }
    
    public List<ArtifactDTO> getActiveArtifacts() {
        List<Artifact> artifacts = artifactRepository.findByIsActive(true);
        return artifactMapper.toDTOList(artifacts);
    }
    
    public ArtifactDTO getArtifactById(Long id) {
        Artifact artifact = artifactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", id));
        return artifactMapper.toDTO(artifact);
    }
    
    public List<ArtifactDTO> getArtifactsByRarity(String rarity) {
        try {
            Artifact.ArtifactRarity artifactRarity = Artifact.ArtifactRarity.valueOf(rarity.toUpperCase());
            List<Artifact> artifacts = artifactRepository.findByRarity(artifactRarity);
            return artifactMapper.toDTOList(artifacts);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Неверная редкость артефакта: " + rarity);
        }
    }
    
    public List<ArtifactDTO> searchArtifactsByName(String name) {
        List<Artifact> artifacts = artifactRepository.findByNameContainingIgnoreCase(name);
        return artifactMapper.toDTOList(artifacts);
    }
    
    @Transactional
    public ArtifactDTO createArtifact(ArtifactCreateDTO artifactCreateDTO) {
        Artifact artifact = artifactMapper.toEntity(artifactCreateDTO);
        Artifact savedArtifact = artifactRepository.save(artifact);
        return artifactMapper.toDTO(savedArtifact);
    }
    
    @Transactional
    public ArtifactDTO updateArtifact(Long id, ArtifactUpdateDTO artifactUpdateDTO) {
        Artifact artifact = artifactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", id));
        
        artifactMapper.updateEntity(artifact, artifactUpdateDTO);
        Artifact savedArtifact = artifactRepository.save(artifact);
        return artifactMapper.toDTO(savedArtifact);
    }
    
    @Transactional
    public void deleteArtifact(Long id) {
        Artifact artifact = artifactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", id));
        artifact.setIsActive(false);
        artifactRepository.save(artifact);
    }
    
    @Transactional
    public ArtifactDTO toggleArtifactStatus(Long id) {
        Artifact artifact = artifactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", id));
        
        artifact.setIsActive(!artifact.getIsActive());
        Artifact savedArtifact = artifactRepository.save(artifact);
        return artifactMapper.toDTO(savedArtifact);
    }
    
}
