package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.RankDTO;
import com.example.alabuga.dto.RankRequirementsCreateDTO;
import com.example.alabuga.dto.RankRequirementsDTO;
import com.example.alabuga.dto.RankRequirementsUpdateDTO;
import com.example.alabuga.entity.Rank;
import com.example.alabuga.entity.RankRequirements;

@Component
public class RankMapper {
    
    public RankDTO toDTO(Rank rank) {
        if (rank == null) {
            return null;
        }
        
        return RankDTO.builder()
                .level(rank.getLevel())
                .name(rank.getName())
                .description(rank.getDescription())
                .branch(rank.getBranch())
                .branchDisplayName(rank.getBranch().getDisplayName())
                .build();
    }
    
    public List<RankDTO> toDTOList(List<Rank> ranks) {
        if (ranks == null) {
            return null;
        }
        
        return ranks.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public RankRequirementsDTO toDTO(RankRequirements rankRequirements) {
        if (rankRequirements == null) {
            return null;
        }
        
        // Получаем название ранга по уровню
        Rank rank = Rank.fromLevel(rankRequirements.getRankLevel());
        
        return RankRequirementsDTO.builder()
                .id(rankRequirements.getId())
                .rankLevel(rankRequirements.getRankLevel())
                .rankName(rank.getName())
                .requiredExperience(rankRequirements.getRequiredExperience())
                .requiredMissionName(rankRequirements.getRequiredMissionName())
                .requiredCompetencyPoints(rankRequirements.getRequiredCompetencyPoints())
                .competencyNames(rankRequirements.getCompetencyNames())
                .isActive(rankRequirements.getIsActive())
                .description(rankRequirements.getDescription())
                .build();
    }
    
    public List<RankRequirementsDTO> toRequirementsDTOList(List<RankRequirements> rankRequirements) {
        if (rankRequirements == null) {
            return null;
        }
        
        return rankRequirements.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public RankRequirements toEntity(RankRequirementsCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        return RankRequirements.builder()
                .rankLevel(dto.getRankLevel())
                .requiredExperience(dto.getRequiredExperience())
                .requiredMissionName(dto.getRequiredMissionName())
                .requiredCompetencyPoints(dto.getRequiredCompetencyPoints())
                .competencyNames(dto.getCompetencyNames())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .description(dto.getDescription())
                .build();
    }

    public void updateEntity(RankRequirements rankRequirements, RankRequirementsUpdateDTO dto) {
        if (rankRequirements == null || dto == null) {
            return;
        }

        if (dto.getRankLevel() != null) {
            rankRequirements.setRankLevel(dto.getRankLevel());
        }
        if (dto.getRequiredExperience() != null) {
            rankRequirements.setRequiredExperience(dto.getRequiredExperience());
        }
        if (dto.getRequiredMissionName() != null) {
            rankRequirements.setRequiredMissionName(dto.getRequiredMissionName());
        }
        if (dto.getRequiredCompetencyPoints() != null) {
            rankRequirements.setRequiredCompetencyPoints(dto.getRequiredCompetencyPoints());
        }
        if (dto.getCompetencyNames() != null) {
            rankRequirements.setCompetencyNames(dto.getCompetencyNames());
        }
        if (dto.getIsActive() != null) {
            rankRequirements.setIsActive(dto.getIsActive());
        }
        if (dto.getDescription() != null) {
            rankRequirements.setDescription(dto.getDescription());
        }
    }
}
