package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.UserCreateDTO;
import com.example.alabuga.dto.UserDTO;
import com.example.alabuga.dto.UserUpdateDTO;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserArtifact;
import com.example.alabuga.entity.UserCompetency;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserMapper {
    
    private final CompetencyMapper competencyMapper;
    private final ArtifactMapper artifactMapper;
    
    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        
        return UserDTO.builder()
                .id(user.getId())
                .login(user.getLogin())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .experience(user.getExperience())
                .mana(user.getMana())
                .rank(user.getRank())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .isActive(user.getIsActive())
                .competencies(user.getCompetencies() != null ? 
                    user.getCompetencies().stream()
                        .map(competencyMapper::toDTO)
                        .collect(Collectors.toList()) : null)
                .artifacts(user.getArtifacts() != null ? 
                    user.getArtifacts().stream()
                        .map(artifactMapper::toDTO)
                        .collect(Collectors.toList()) : null)
                .build();
    }
    
    public User toEntity(UserCreateDTO dto) {
        if (dto == null) {
            return null;
        }
        
        return User.builder()
                .login(dto.getLogin())
                .email(dto.getEmail())
                .passwordHash(dto.getPassword()) // В реальном приложении здесь должно быть хеширование
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .role(dto.getRole())
                .experience(dto.getExperience())
                .mana(dto.getMana())
                .rank(dto.getRank())
                .isActive(true)
                .build();
    }
    
    public void updateEntity(User user, UserUpdateDTO dto) {
        if (user == null || dto == null) {
            return;
        }
        
        if (dto.getLogin() != null) {
            user.setLogin(dto.getLogin());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getPassword() != null) {
            user.setPasswordHash(dto.getPassword()); // В реальном приложении здесь должно быть хеширование
        }
        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
        if (dto.getExperience() != null) {
            user.setExperience(dto.getExperience());
        }
        if (dto.getMana() != null) {
            user.setMana(dto.getMana());
        }
        if (dto.getRank() != null) {
            user.setRank(dto.getRank());
        }
        if (dto.getIsActive() != null) {
            user.setIsActive(dto.getIsActive());
        }
    }
    
    public List<UserDTO> toDTOList(List<User> users) {
        if (users == null) {
            return null;
        }
        
        return users.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
