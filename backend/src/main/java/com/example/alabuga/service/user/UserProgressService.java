package com.example.alabuga.service.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.UserDTO;
import com.example.alabuga.entity.Rank;
import com.example.alabuga.entity.User;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.UserMapper;
import com.example.alabuga.repository.UserRepository;
import com.example.alabuga.service.NotificationService;

import lombok.RequiredArgsConstructor;

/**
 * Сервис для управления прогрессом пользователей (опыт, энергия, ранги)
 * Отвечает за игровую механику прогресса
 */
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserProgressService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final NotificationService notificationService;
    private final UserNotificationService userNotificationService;
    private final UserBranchService userBranchService;

    // ========== USER STATS OPERATIONS ==========

    @Transactional
    public UserDTO addExperience(Long userId, Integer experience) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));

        user.setExperience(user.getExperience() + experience);

        // Обновляем ранг на основе опыта (каждые 1000 опыта = +1 ранг)
        int newRank = (user.getExperience() / 1000) + 1;

        // Проверяем, был ли повышен ранг
        if (newRank > user.getRank()) {
            // Проверяем, может ли пользователь повысить ранг
            if (!userBranchService.canPromoteRank(userId)) {
                throw new BusinessLogicException("Необходимо выбрать ветку развития для повышения ранга");
            }

            int oldRank = user.getRank();
            
            // Получаем следующий ранг с учетом выбранной ветки
            Rank nextRank = userBranchService.getNextRank(userId);
            if (nextRank == null) {
                throw new BusinessLogicException("Максимальный ранг достигнут");
            }

            user.setRank(nextRank.getLevel());

            // Создаем уведомление о повышении ранга
            Rank oldRankObj = Rank.fromLevel(oldRank);
            notificationService.createRankPromotionNotification(user, oldRankObj, nextRank);

            // Для рангов 2-4 создаем уведомление о необходимости выбора ветки миссий
            if (nextRank.getLevel() >= 2 && nextRank.getLevel() <= 4 && user.getSelectedBranchId() == null) {
                userNotificationService.createBranchSelectionNotification(user, nextRank.getLevel());
            }
        } else {
            // Если ранг не изменился, но нужно проверить текущий ранг
            Rank currentRank = userBranchService.getCurrentBranch(userId) == Rank.RankBranch.LUNAR_DOCK 
                ? Rank.fromLevelAndBranch(user.getRank(), Rank.RankBranch.LUNAR_DOCK)
                : Rank.fromLevelAndBranch(user.getRank(), userBranchService.getCurrentBranch(userId));
            
            if (currentRank != null) {
                user.setRank(currentRank.getLevel());
            }
        }

        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    @Transactional
    public UserDTO addEnergy(Long userId, Integer energy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));

        user.setEnergy(user.getEnergy() + energy);
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    @Transactional
    public UserDTO spendEnergy(Long userId, Integer energy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));

        if (user.getEnergy() < energy) {
            throw new BusinessLogicException("Недостаточно Энергонов. Текущие Энергоны: %d, требуется: %d", user.getEnergy(), energy);
        }

        user.setEnergy(user.getEnergy() - energy);
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }
}
