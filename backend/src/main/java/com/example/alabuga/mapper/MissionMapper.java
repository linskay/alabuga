package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.MissionCreateDTO;
import com.example.alabuga.dto.MissionDTO;
import com.example.alabuga.dto.MissionUpdateDTO;
import com.example.alabuga.dto.UserMissionDTO;
import com.example.alabuga.entity.Mission;
import com.example.alabuga.entity.MissionBranch;
import com.example.alabuga.entity.MissionDifficulty;
import com.example.alabuga.entity.MissionType;
import com.example.alabuga.entity.UserMission;

@Component
public class MissionMapper {
    
    public MissionDTO toDTO(Mission mission) {
        if (mission == null) {
            return null;
        }
        
        String branchName = getBranchName(mission.getBranchId());
        
        return MissionDTO.builder()
                .id(mission.getId())
                .name(mission.getName())
                .description(mission.getDescription())
                .branchId(mission.getBranchId())
                .branchName(branchName)
                .type(mission.getType().name())
                .difficulty(mission.getDifficulty().name())
                .experienceReward(mission.getExperienceReward())
                .energyReward(mission.getEnergyReward())
                .requiredCompetencies(mission.getRequiredCompetencies())
                .isActive(mission.getIsActive())
                .requiresModeration(mission.getRequiresModeration())
                .artifactRewardId(mission.getArtifactRewardId())
                .build();
    }
    
    public List<MissionDTO> toDTOList(List<Mission> missions) {
        if (missions == null) {
            return null;
        }
        
        return missions.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public UserMissionDTO toUserMissionDTO(UserMission userMission) {
        if (userMission == null) {
            return null;
        }
        
        String branchName = getBranchName(userMission.getMission().getBranchId());
        
        return UserMissionDTO.builder()
                .id(userMission.getId())
                .userId(userMission.getUser().getId())
                .missionId(userMission.getMission().getId())
                .missionName(userMission.getMission().getName())
                .branchName(branchName)
                .status(userMission.getStatus().name())
                .progress(userMission.getProgress())
                .startedAt(userMission.getStartedAt())
                .completedAt(userMission.getCompletedAt())
                .notes(userMission.getNotes())
                .build();
    }
    
    public List<UserMissionDTO> toUserMissionDTOList(List<UserMission> userMissions) {
        if (userMissions == null) {
            return null;
        }
        
        return userMissions.stream()
                .map(this::toUserMissionDTO)
                .collect(Collectors.toList());
    }
    
    public Mission toEntity(MissionCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        return Mission.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .branchId(dto.getBranchId())
                .type(parseMissionType(dto.getType()))
                .difficulty(parseMissionDifficulty(dto.getDifficulty()))
                .experienceReward(dto.getExperienceReward())
                .energyReward(dto.getEnergyReward())
                .requiredCompetencies(dto.getRequiredCompetencies())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .requiresModeration(dto.getRequiresModeration() != null ? dto.getRequiresModeration() : false)
                .artifactRewardId(dto.getArtifactRewardId())
                .build();
    }

    public void updateEntity(Mission mission, MissionUpdateDTO dto) {
        if (mission == null || dto == null) {
            return;
        }

        if (dto.getName() != null) {
            mission.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            mission.setDescription(dto.getDescription());
        }
        if (dto.getBranchId() != null) {
            mission.setBranchId(dto.getBranchId());
        }
        if (dto.getType() != null) {
            mission.setType(parseMissionType(dto.getType()));
        }
        if (dto.getDifficulty() != null) {
            mission.setDifficulty(parseMissionDifficulty(dto.getDifficulty()));
        }
        if (dto.getExperienceReward() != null) {
            mission.setExperienceReward(dto.getExperienceReward());
        }
        if (dto.getEnergyReward() != null) {
            mission.setEnergyReward(dto.getEnergyReward());
        }
        if (dto.getRequiredCompetencies() != null) {
            mission.setRequiredCompetencies(dto.getRequiredCompetencies());
        }
        if (dto.getIsActive() != null) {
            mission.setIsActive(dto.getIsActive());
        }
        if (dto.getRequiresModeration() != null) {
            mission.setRequiresModeration(dto.getRequiresModeration());
        }
        if (dto.getArtifactRewardId() != null) {
            mission.setArtifactRewardId(dto.getArtifactRewardId());
        }
    }

    private MissionType parseMissionType(String type) {
        try {
            return MissionType.valueOf(type);
        } catch (IllegalArgumentException e) {
            return MissionType.QUEST; // Default value
        }
    }

    private MissionDifficulty parseMissionDifficulty(String difficulty) {
        try {
            return MissionDifficulty.valueOf(difficulty);
        } catch (IllegalArgumentException e) {
            return MissionDifficulty.EASY; // Default value
        }
    }

    private String getBranchName(Long branchId) {
        try {
            MissionBranch branch = MissionBranch.fromId(branchId);
            return branch.getName();
        } catch (Exception e) {
            return "Неизвестная ветка";
        }
    }
}
