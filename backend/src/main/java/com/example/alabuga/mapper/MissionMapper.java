package com.example.alabuga.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.alabuga.dto.MissionDTO;
import com.example.alabuga.dto.UserMissionDTO;
import com.example.alabuga.entity.Mission;
import com.example.alabuga.entity.MissionBranch;
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
                .manaReward(mission.getManaReward())
                .requiredCompetencies(mission.getRequiredCompetencies())
                .isActive(mission.getIsActive())
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
    
    private String getBranchName(Long branchId) {
        try {
            MissionBranch branch = MissionBranch.fromId(branchId);
            return branch.getName();
        } catch (Exception e) {
            return "Неизвестная ветка";
        }
    }
}
