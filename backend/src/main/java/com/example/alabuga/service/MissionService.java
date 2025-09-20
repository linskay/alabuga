package com.example.alabuga.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.MissionDTO;
import com.example.alabuga.dto.UserMissionDTO;
import com.example.alabuga.entity.Mission;
import com.example.alabuga.entity.MissionStatus;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserMission;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.MissionMapper;
import com.example.alabuga.repository.MissionRepository;
import com.example.alabuga.repository.UserMissionRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MissionService {
    
    private final MissionRepository missionRepository;
    private final UserMissionRepository userMissionRepository;
    private final UserRepository userRepository;
    private final MissionMapper missionMapper;
    
    public List<MissionDTO> getAllMissions() {
        List<Mission> missions = missionRepository.findByIsActive(true);
        return missionMapper.toDTOList(missions);
    }
    
    public List<MissionDTO> getMissionsByBranch(Long branchId) {
        List<Mission> missions = missionRepository.findActiveMissionsByBranch(branchId);
        return missionMapper.toDTOList(missions);
    }
    
    public MissionDTO getMissionById(Long id) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Миссия", id));
        return missionMapper.toDTO(mission);
    }
    
    public List<UserMissionDTO> getUserMissions(Long userId) {
        List<UserMission> userMissions = userMissionRepository.findByUserId(userId);
        return missionMapper.toUserMissionDTOList(userMissions);
    }
    
    public List<UserMissionDTO> getUserMissionsByBranch(Long userId, Long branchId) {
        List<UserMission> userMissions = userMissionRepository.findByUserIdAndBranchId(userId, branchId);
        return missionMapper.toUserMissionDTOList(userMissions);
    }
    
    @Transactional
    public UserMissionDTO startMission(Long userId, Long missionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Миссия", missionId));
        
        // Проверяем, не начата ли уже миссия
        Optional<UserMission> existingUserMission = userMissionRepository.findByUserIdAndMissionId(userId, missionId);
        if (existingUserMission.isPresent()) {
            throw new BusinessLogicException("Миссия уже начата");
        }
        
        // Проверяем, активна ли миссия
        if (!mission.getIsActive()) {
            throw new BusinessLogicException("Миссия неактивна");
        }
        
        UserMission userMission = UserMission.builder()
                .user(user)
                .mission(mission)
                .status(MissionStatus.IN_PROGRESS)
                .progress(0)
                .startedAt(LocalDateTime.now())
                .build();
        
        UserMission savedUserMission = userMissionRepository.save(userMission);
        return missionMapper.toUserMissionDTO(savedUserMission);
    }
    
    @Transactional
    public UserMissionDTO updateMissionProgress(Long userId, Long missionId, Integer progress, String notes) {
        UserMission userMission = userMissionRepository.findByUserIdAndMissionId(userId, missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Прогресс миссии", missionId));
        
        if (userMission.getStatus() != MissionStatus.IN_PROGRESS) {
            throw new BusinessLogicException("Миссия не в процессе выполнения");
        }
        
        userMission.setProgress(Math.min(100, Math.max(0, progress)));
        if (notes != null) {
            userMission.setNotes(notes);
        }
        
        // Если прогресс достиг 100%, завершаем миссию
        if (userMission.getProgress() >= 100) {
            userMission.setStatus(MissionStatus.COMPLETED);
            userMission.setCompletedAt(LocalDateTime.now());
            
            // Начисляем награды пользователю
            User user = userMission.getUser();
            Mission mission = userMission.getMission();
            
            user.setExperience(user.getExperience() + mission.getExperienceReward());
            user.setMana(user.getMana() + mission.getManaReward());
            userRepository.save(user);
        }
        
        UserMission savedUserMission = userMissionRepository.save(userMission);
        return missionMapper.toUserMissionDTO(savedUserMission);
    }
    
    @Transactional
    public UserMissionDTO completeMission(Long userId, Long missionId) {
        UserMission userMission = userMissionRepository.findByUserIdAndMissionId(userId, missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Прогресс миссии", missionId));
        
        if (userMission.getStatus() == MissionStatus.COMPLETED) {
            throw new BusinessLogicException("Миссия уже завершена");
        }
        
        userMission.setStatus(MissionStatus.COMPLETED);
        userMission.setProgress(100);
        userMission.setCompletedAt(LocalDateTime.now());
        
        // Начисляем награды пользователю
        User user = userMission.getUser();
        Mission mission = userMission.getMission();
        
        user.setExperience(user.getExperience() + mission.getExperienceReward());
        user.setMana(user.getMana() + mission.getManaReward());
        userRepository.save(user);
        
        UserMission savedUserMission = userMissionRepository.save(userMission);
        return missionMapper.toUserMissionDTO(savedUserMission);
    }
}
