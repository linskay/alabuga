package com.example.alabuga.service.user;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.UserDTO;
import com.example.alabuga.entity.Rank;
import com.example.alabuga.entity.User;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.UserMapper;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Сервис для управления ветками развития пользователей
 * Отвечает за выбор ветки развития и переходы между рангами
 */
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserBranchService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final com.example.alabuga.service.RankService rankService;

    // ========== BRANCH SELECTION ==========

    /**
     * Выбрать ветку развития для пользователя
     * Разрешено, если:
     *  - Ранг 2-4 и ветка ещё не выбрана (старая логика)
     *  - Ранг 1 и пользователь выполнил требования для перехода на ранг 2 (ветка ещё не выбрана)
     */
    @Transactional
    public UserDTO selectBranch(Long userId, Rank.RankBranch branch) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));

        // Нельзя выбирать стартовую ветку
        if (branch == Rank.RankBranch.LUNAR_DOCK) {
            throw new BusinessLogicException("Нельзя выбрать стартовую ветку 'Док Лунной Станции'");
        }

        // Ветка уже выбрана
        if (user.getSelectedBranchId() != null) {
            throw new BusinessLogicException("Ветка развития уже выбрана. Текущая ветка: " + getCurrentBranchName(user));
        }

        boolean isRank24 = user.getRank() >= 2 && user.getRank() <= 4;
        boolean isRank1Eligible = user.getRank() == 1 && rankService.checkUserCanBePromoted(userId);

        if (!isRank24 && !isRank1Eligible) {
            throw new BusinessLogicException("Выбор ветки недоступен для текущего ранга " + user.getRank() + ". Выполните требования для перехода на 2 ранг.");
        }

        // Устанавливаем выбранную ветку
        user.setSelectedBranchId(getBranchId(branch));

        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    /**
     * Получить доступные ветки для выбора
     */
    public List<Rank.RankBranch> getAvailableBranches(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));

        // Если ветка уже выбрана, возвращаем только текущую
        if (user.getSelectedBranchId() != null) {
            return List.of(getCurrentBranch(user));
        }

        // Если ранг 1 и выполнены требования для перехода на 2 — показываем три ветки
        if (user.getRank() == 1 && rankService.checkUserCanBePromoted(userId)) {
            return List.of(
                Rank.RankBranch.ANALYTICAL_TECHNICAL,
                Rank.RankBranch.HUMANITARIAN_RESEARCH,
                Rank.RankBranch.COMMUNICATION_LEADERSHIP
            );
        }

        // Если ранг 2-4 и ветка не выбрана, возвращаем все доступные ветки кроме стартовой
        if (user.getRank() >= 2 && user.getRank() <= 4) {
            return List.of(
                Rank.RankBranch.ANALYTICAL_TECHNICAL,
                Rank.RankBranch.HUMANITARIAN_RESEARCH,
                Rank.RankBranch.COMMUNICATION_LEADERSHIP
            );
        }

        // Для других рангов возвращаем пустой список
        return List.of();
    }

    /**
     * Получить текущую ветку пользователя
     */
    public Rank.RankBranch getCurrentBranch(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        return getCurrentBranch(user);
    }

    /**
     * Проверить, может ли пользователь повысить ранг
     */
    public boolean canPromoteRank(Long userId) {
        // Делегируем реальной проверке требований ранга, чтобы фронт видел точное состояние
        return rankService.checkUserCanBePromoted(userId);
    }

    /**
     * Получить следующий ранг для пользователя
     */
    public Rank getNextRank(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));

        int currentLevel = user.getRank();
        int nextLevel = currentLevel + 1;

        // Если это максимальный ранг
        if (nextLevel > 5) {
            return null;
        }

        // Если это ранг 2-4, используем выбранную ветку
        if (nextLevel >= 2 && nextLevel <= 4) {
            if (user.getSelectedBranchId() != null) {
                Rank.RankBranch selectedBranch = getCurrentBranch(user);
                return Rank.fromLevelAndBranch(nextLevel, selectedBranch);
            }
            return null; // Ветка не выбрана
        }

        // Для ранга 1 и 5 используем стартовую ветку
        if (nextLevel == 1 || nextLevel == 5) {
            return Rank.fromLevelAndBranch(nextLevel, Rank.RankBranch.LUNAR_DOCK);
        }

        return null;
    }

    // ========== PRIVATE HELPER METHODS ==========

    private Rank.RankBranch getCurrentBranch(User user) {
        if (user.getSelectedBranchId() == null) {
            // Если ветка не выбрана, возвращаем стартовую ветку
            return Rank.RankBranch.LUNAR_DOCK;
        }

        return getBranchFromId(user.getSelectedBranchId());
    }

    private String getCurrentBranchName(User user) {
        return getCurrentBranch(user).getDisplayName();
    }

    private Long getBranchId(Rank.RankBranch branch) {
        return switch (branch) {
            case LUNAR_DOCK -> 1L;
            case ANALYTICAL_TECHNICAL -> 2L;
            case HUMANITARIAN_RESEARCH -> 3L;
            case COMMUNICATION_LEADERSHIP -> 4L;
            case FINAL -> 5L;
        };
    }

    private Rank.RankBranch getBranchFromId(Long branchId) {
        return switch (branchId.intValue()) {
            case 1 -> Rank.RankBranch.LUNAR_DOCK;
            case 2 -> Rank.RankBranch.ANALYTICAL_TECHNICAL;
            case 3 -> Rank.RankBranch.HUMANITARIAN_RESEARCH;
            case 4 -> Rank.RankBranch.COMMUNICATION_LEADERSHIP;
            case 5 -> Rank.RankBranch.FINAL;
            default -> Rank.RankBranch.LUNAR_DOCK;
        };
    }
}
