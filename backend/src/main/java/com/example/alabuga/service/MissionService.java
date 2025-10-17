package com.example.alabuga.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.MissionCreateDTO;
import com.example.alabuga.dto.MissionDTO;
import com.example.alabuga.dto.MissionUpdateDTO;
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
import com.example.alabuga.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MissionService {
    
    private final MissionRepository missionRepository;
    private final UserMissionRepository userMissionRepository;
    private final UserRepository userRepository;
    private final MissionMapper missionMapper;
    private final NotificationService notificationService;
    
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
        
        // Если прогресс достиг 100%, проверяем нужна ли модерация
        if (userMission.getProgress() >= 100) {
            Mission mission = userMission.getMission();
            if (mission.getRequiresModeration()) {
                // Миссия требует модерации - оставляем в статусе IN_PROGRESS
                // Пользователь не может завершить миссию самостоятельно
            } else {
                // Миссия не требует модерации - завершаем автоматически
                userMission.setStatus(MissionStatus.COMPLETED);
                userMission.setCompletedAt(LocalDateTime.now());
                
                // Начисляем награды пользователю
                User user = userMission.getUser();
                user.setExperience(user.getExperience() + mission.getExperienceReward());
                        user.setEnergy(user.getEnergy() + mission.getEnergyReward());
                userRepository.save(user);
            }
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
        
        Mission mission = userMission.getMission();
        if (mission.getRequiresModeration()) {
            throw new BusinessLogicException("Миссия требует модерации и не может быть завершена пользователем");
        }
        
        userMission.setStatus(MissionStatus.COMPLETED);
        userMission.setProgress(100);
        userMission.setCompletedAt(LocalDateTime.now());
        
        // Начисляем награды пользователю
        User user = userMission.getUser();
        user.setExperience(user.getExperience() + mission.getExperienceReward());
                        user.setEnergy(user.getEnergy() + mission.getEnergyReward());
        userRepository.save(user);
        
        UserMission savedUserMission = userMissionRepository.save(userMission);
        
        // Создаем уведомление о завершении миссии
        notificationService.createMissionCompletedNotification(user, mission.getName(), mission.getExperienceReward(), mission.getEnergyReward());
        
        return missionMapper.toUserMissionDTO(savedUserMission);
    }

    @Transactional
    public MissionDTO createMission(MissionCreateDTO missionCreateDTO) {
        Mission mission = missionMapper.toEntity(missionCreateDTO);
        Mission savedMission = missionRepository.save(mission);
        return missionMapper.toDTO(savedMission);
    }

    @Transactional
    public MissionDTO updateMission(Long id, MissionUpdateDTO missionUpdateDTO) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Миссия", id));
        
        missionMapper.updateEntity(mission, missionUpdateDTO);
        Mission savedMission = missionRepository.save(mission);
        return missionMapper.toDTO(savedMission);
    }

    @Transactional
    public void deleteMission(Long id) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Миссия", id));
        
        // Проверяем, есть ли активные пользовательские миссии
        List<UserMission> activeUserMissions = userMissionRepository.findByMissionIdAndStatusIn(
                id, List.of(MissionStatus.IN_PROGRESS, MissionStatus.NOT_STARTED));
        
        if (!activeUserMissions.isEmpty()) {
            throw new BusinessLogicException("Нельзя удалить миссию с активными пользователями");
        }
        
        missionRepository.delete(mission);
    }

    @Transactional
    public UserMissionDTO moderateMission(Long userId, Long missionId, boolean approved) {
        UserMission userMission = userMissionRepository.findByUserIdAndMissionId(userId, missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Прогресс миссии", missionId));
        
        Mission mission = userMission.getMission();
        if (!mission.getRequiresModeration()) {
            throw new BusinessLogicException("Миссия не требует модерации");
        }
        
        if (userMission.getStatus() != MissionStatus.IN_PROGRESS) {
            throw new BusinessLogicException("Миссия не в процессе выполнения");
        }
        
        if (approved) {
            userMission.setStatus(MissionStatus.COMPLETED);
            userMission.setProgress(100);
            userMission.setCompletedAt(LocalDateTime.now());
            
            // Начисляем награды пользователю
            User user = userMission.getUser();
            user.setExperience(user.getExperience() + mission.getExperienceReward());
                        user.setEnergy(user.getEnergy() + mission.getEnergyReward());
            userRepository.save(user);
        } else {
            userMission.setStatus(MissionStatus.FAILED);
        }
        
        UserMission savedUserMission = userMissionRepository.save(userMission);
        return missionMapper.toUserMissionDTO(savedUserMission);
    }
}
