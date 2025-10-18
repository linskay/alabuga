package com.example.alabuga.service.user;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.UserMissionDTO;
import com.example.alabuga.entity.Mission;
import com.example.alabuga.entity.MissionStatus;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserMission;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.repository.MissionRepository;
import com.example.alabuga.repository.UserMissionRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Сервис для управления миссиями пользователей
 * Отвечает за выполнение и отслеживание миссий
 */
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserMissionService {

    private final UserRepository userRepository;
    private final MissionRepository missionRepository;
    private final UserMissionRepository userMissionRepository;

    public List<UserMissionDTO> getUserMissions(Long userId) {
        List<UserMission> userMissions = userMissionRepository.findByUserId(userId);
        return userMissions.stream()
                .map(this::mapToUserMissionDTO)
                .toList();
    }

    @Transactional
    public UserMissionDTO takeMission(Long userId, Long missionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));

        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Миссия", missionId));

        // Проверяем, не взял ли уже пользователь эту миссию
        Optional<UserMission> existingMission = userMissionRepository.findByUserIdAndMissionId(userId, missionId);
        if (existingMission.isPresent()) {
            throw new BusinessLogicException("Пользователь уже взял эту миссию");
        }

        // Проверки доступности по рангу/опыту опущены, т.к. у сущности Mission нет таких полей.
        // При необходимости можно добавить бизнес-логику проверки компетенций через requiredCompetencies.

        // Создаем UserMission
        UserMission userMission = UserMission.builder()
                .user(user)
                .mission(mission)
                .status(MissionStatus.IN_PROGRESS)
                .progress(0)
                .startedAt(LocalDateTime.now())
                .build();

        UserMission savedUserMission = userMissionRepository.save(userMission);
        return mapToUserMissionDTO(savedUserMission);
    }

    @Transactional
    public void removeMissionFromUser(Long userId, Long missionId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Пользователь", userId);
        }

        if (!missionRepository.existsById(missionId)) {
            throw new ResourceNotFoundException("Миссия", missionId);
        }

        Optional<UserMission> userMissionOpt = userMissionRepository.findByUserIdAndMissionId(userId, missionId);
        if (userMissionOpt.isEmpty()) {
            throw new BusinessLogicException("У пользователя нет этой миссии");
        }

        userMissionRepository.delete(userMissionOpt.get());
    }

    private UserMissionDTO mapToUserMissionDTO(UserMission userMission) {
        return UserMissionDTO.builder()
                .id(userMission.getId())
                .userId(userMission.getUser().getId())
                .missionId(userMission.getMission().getId())
                .missionName(userMission.getMission().getName())
                .status(userMission.getStatus().name())
                .progress(userMission.getProgress())
                .startedAt(userMission.getStartedAt())
                .completedAt(userMission.getCompletedAt())
                .notes(userMission.getNotes())
                .build();
    }
}
