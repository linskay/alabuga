package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.CompetencyDTO;
import com.example.alabuga.dto.UserCompetencyDTO;
import com.example.alabuga.entity.Competency;
import com.example.alabuga.entity.UserCompetency;

@Component
public class CompetencyMapper {
    
    public CompetencyDTO toDTO(Competency competency) {
        if (competency == null) {
            return null;
        }
        
        return CompetencyDTO.builder()
                .id(competency.getId())
                .name(competency.getName())
                .shortDescription(competency.getShortDescription())
                .description(competency.getDescription())
                .isActive(competency.getIsActive())
                .build();
    }
    
    public UserCompetencyDTO toDTO(UserCompetency userCompetency) {
        if (userCompetency == null) {
            return null;
        }
        
        return UserCompetencyDTO.builder()
                .id(userCompetency.getId())
                .userId(userCompetency.getUser() != null ? userCompetency.getUser().getId() : null)
                .competencyId(userCompetency.getCompetency() != null ? userCompetency.getCompetency().getId() : null)
                .competencyName(userCompetency.getCompetency() != null ? userCompetency.getCompetency().getName() : null)
                .competencyShortDescription(userCompetency.getCompetency() != null ? userCompetency.getCompetency().getShortDescription() : null)
                .competencyDescription(userCompetency.getCompetency() != null ? userCompetency.getCompetency().getDescription() : null)
                .experiencePoints(userCompetency.getExperiencePoints())
                .isActive(true) // UserCompetency не имеет поля isActive, используем true по умолчанию
                .build();
    }
    
    public List<CompetencyDTO> toDTOList(List<Competency> competencies) {
        if (competencies == null) {
            return null;
        }
        
        return competencies.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserCompetencyDTO> toUserCompetencyDTOList(List<UserCompetency> userCompetencies) {
        if (userCompetencies == null) {
            return null;
        }
        
        return userCompetencies.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
