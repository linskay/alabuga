package com.example.alabuga.service.user;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.CompetencyDTO;
import com.example.alabuga.dto.UserCompetencyDTO;
import com.example.alabuga.entity.Competency;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserCompetency;
import com.example.alabuga.exception.DuplicateResourceException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.CompetencyMapper;
import com.example.alabuga.repository.CompetencyRepository;
import com.example.alabuga.repository.UserCompetencyRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Сервис для управления компетенциями пользователей
 * Отвечает за развитие навыков и компетенций
 */
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserCompetencyService {

    private final UserRepository userRepository;
    private final CompetencyRepository competencyRepository;
    private final UserCompetencyRepository userCompetencyRepository;
    private final CompetencyMapper competencyMapper;

    // ========== COMPETENCY OPERATIONS ==========

    public List<CompetencyDTO> getAllCompetencies() {
        List<Competency> competencies = competencyRepository.findByIsActive(true);
        return competencyMapper.toDTOList(competencies);
    }

    public List<UserCompetencyDTO> getUserCompetencies(Long userId) {
        List<UserCompetency> userCompetencies = userCompetencyRepository.findByUserId(userId);
        return competencyMapper.toUserCompetencyDTOList(userCompetencies);
    }

    @Transactional
    public UserCompetencyDTO addUserCompetency(Long userId, Long competencyId, Integer initialLevel) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));

        Competency competency = competencyRepository.findById(competencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Компетенция", competencyId));

        // Проверяем, есть ли уже такая компетенция у пользователя
        if (userCompetencyRepository.findByUserIdAndCompetencyId(userId, competencyId).isPresent()) {
            throw new DuplicateResourceException("У пользователя уже есть компетенция " + competency.getName());
        }

        UserCompetency userCompetency = UserCompetency.builder()
                .user(user)
                .competency(competency)
                .experiencePoints(0)
                .build();

        UserCompetency savedUserCompetency = userCompetencyRepository.save(userCompetency);
        return competencyMapper.toDTO(savedUserCompetency);
    }

    @Transactional
    public UserCompetencyDTO updateCompetencyExperience(Long userId, Long competencyId, Integer experiencePoints) {
        UserCompetency userCompetency = userCompetencyRepository.findByUserIdAndCompetencyId(userId, competencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Компетенция у пользователя"));

        // Устанавливаем очки опыта (максимум 500)
        int newExperiencePoints = Math.min(experiencePoints, 500);
        userCompetency.setExperiencePoints(newExperiencePoints);

        UserCompetency savedUserCompetency = userCompetencyRepository.save(userCompetency);
        return competencyMapper.toDTO(savedUserCompetency);
    }

    // ========== COMPETENCY TRACKING METHODS ==========

    @Transactional
    public void addAllCompetenciesToUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));

        List<Competency> allCompetencies = competencyRepository.findByIsActive(true);

        for (Competency competency : allCompetencies) {
            // Проверяем, есть ли уже такая компетенция у пользователя
            boolean exists = userCompetencyRepository.findByUserIdAndCompetencyId(userId, competency.getId()).isPresent();

            if (!exists) {
                UserCompetency userCompetency = UserCompetency.builder()
                        .user(user)
                        .competency(competency)
                        .experiencePoints(0)
                        .build();

                userCompetencyRepository.save(userCompetency);
            }
        }
    }

    @Transactional
    public UserCompetencyDTO addExperienceToCompetency(Long userId, Long competencyId, Integer experiencePoints) {
        UserCompetency userCompetency = userCompetencyRepository.findByUserIdAndCompetencyId(userId, competencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Компетенция у пользователя"));

        // Добавляем очки опыта (максимум 500)
        int newExperiencePoints = Math.min(userCompetency.getExperiencePoints() + experiencePoints, 500);
        userCompetency.setExperiencePoints(newExperiencePoints);

        UserCompetency savedUserCompetency = userCompetencyRepository.save(userCompetency);
        return competencyMapper.toDTO(savedUserCompetency);
    }
}
