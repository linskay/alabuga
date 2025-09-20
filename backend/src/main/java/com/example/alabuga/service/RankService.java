package com.example.alabuga.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.RankDTO;
import com.example.alabuga.dto.RankRequirementsCreateDTO;
import com.example.alabuga.dto.RankRequirementsDTO;
import com.example.alabuga.dto.RankRequirementsUpdateDTO;
import com.example.alabuga.entity.Rank;
import com.example.alabuga.entity.RankRequirements;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserCompetency;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.RankMapper;
import com.example.alabuga.repository.RankRequirementsRepository;
import com.example.alabuga.repository.UserCompetencyRepository;
import com.example.alabuga.repository.UserMissionRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RankService {
    
    private final RankRequirementsRepository rankRequirementsRepository;
    private final UserRepository userRepository;
    private final UserCompetencyRepository userCompetencyRepository;
    private final UserMissionRepository userMissionRepository;
    private final RankMapper rankMapper;
    
    // ========== RANK MANAGEMENT ==========
    
    public List<RankDTO> getAllRanks() {
        List<Rank> ranks = List.of(Rank.values());
        return rankMapper.toDTOList(ranks);
    }
    
    public List<RankDTO> getRanksByBranch(Rank.RankBranch branch) {
        List<Rank> ranks = List.of(Rank.values())
                .stream()
                .filter(rank -> rank.getBranch() == branch)
                .toList();
        return rankMapper.toDTOList(ranks);
    }
    
    public RankDTO getRankByLevel(Integer level) {
        Rank rank = Rank.fromLevel(level);
        return rankMapper.toDTO(rank);
    }
    
    // ========== RANK REQUIREMENTS MANAGEMENT ==========
    
    public List<RankRequirementsDTO> getAllRankRequirements() {
        List<RankRequirements> requirements = rankRequirementsRepository.findAll();
        return rankMapper.toRequirementsDTOList(requirements);
    }
    
    public List<RankRequirementsDTO> getActiveRankRequirements() {
        List<RankRequirements> requirements = rankRequirementsRepository.findByIsActive(true);
        return rankMapper.toRequirementsDTOList(requirements);
    }
    
    public RankRequirementsDTO getRankRequirementsByLevel(Integer rankLevel) {
        RankRequirements requirements = rankRequirementsRepository.findByRankLevel(rankLevel)
                .orElseThrow(() -> new ResourceNotFoundException("Требования ранга", rankLevel));
        return rankMapper.toDTO(requirements);
    }
    
    @Transactional
    public RankRequirementsDTO createRankRequirements(RankRequirementsCreateDTO dto) {
        // Проверяем, не существуют ли уже требования для этого ранга
        if (rankRequirementsRepository.findByRankLevel(dto.getRankLevel()).isPresent()) {
            throw new BusinessLogicException("Требования для ранга уровня " + dto.getRankLevel() + " уже существуют");
        }
        
        RankRequirements requirements = rankMapper.toEntity(dto);
        RankRequirements savedRequirements = rankRequirementsRepository.save(requirements);
        return rankMapper.toDTO(savedRequirements);
    }
    
    @Transactional
    public RankRequirementsDTO updateRankRequirements(Long id, RankRequirementsUpdateDTO dto) {
        RankRequirements requirements = rankRequirementsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Требования ранга", id));
        
        rankMapper.updateEntity(requirements, dto);
        RankRequirements savedRequirements = rankRequirementsRepository.save(requirements);
        return rankMapper.toDTO(savedRequirements);
    }
    
    @Transactional
    public void deleteRankRequirements(Long id) {
        RankRequirements requirements = rankRequirementsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Требования ранга", id));
        
        rankRequirementsRepository.delete(requirements);
    }
    
    // ========== RANK PROMOTION ==========
    
    @Transactional
    public User promoteUserToNextRank(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        // Получаем текущий ранг пользователя
        Rank currentRank = Rank.fromLevel(user.getRank());
        
        // Находим следующий ранг
        Rank nextRank = getNextRank(currentRank);
        if (nextRank == null) {
            throw new BusinessLogicException("Пользователь уже имеет максимальный ранг");
        }
        
        // Проверяем требования для следующего ранга
        RankRequirements requirements = rankRequirementsRepository.findByRankLevel(nextRank.getLevel())
                .orElseThrow(() -> new ResourceNotFoundException("Требования для ранга", nextRank.getLevel()));
        
        if (!requirements.getIsActive()) {
            throw new BusinessLogicException("Требования для ранга " + nextRank.getName() + " неактивны");
        }
        
        // Проверяем выполнение требований
        if (!checkRankRequirements(user, requirements)) {
            throw new BusinessLogicException("Пользователь не выполнил требования для повышения до ранга " + nextRank.getName());
        }
        
        // Повышаем ранг
        user.setRank(nextRank.getLevel());
        User savedUser = userRepository.save(user);
        
        return savedUser;
    }
    
    public boolean checkUserCanBePromoted(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        Rank currentRank = Rank.fromLevel(user.getRank());
        Rank nextRank = getNextRank(currentRank);
        
        if (nextRank == null) {
            return false; // Уже максимальный ранг
        }
        
        Optional<RankRequirements> requirementsOpt = rankRequirementsRepository.findByRankLevel(nextRank.getLevel());
        if (requirementsOpt.isEmpty()) {
            return false; // Нет требований для следующего ранга
        }
        
        RankRequirements requirements = requirementsOpt.get();
        if (!requirements.getIsActive()) {
            return false; // Требования неактивны
        }
        
        return checkRankRequirements(user, requirements);
    }
    
    private Rank getNextRank(Rank currentRank) {
        // Логика определения следующего ранга
        // Для простоты берем следующий по уровню
        int nextLevel = currentRank.getLevel() + 1;
        
        // Проверяем, не превышает ли максимальный уровень
        if (nextLevel > Rank.STATION_KEEPER.getLevel()) {
            return null; // Максимальный ранг достигнут
        }
        
        return Rank.fromLevel(nextLevel);
    }
    
    private boolean checkRankRequirements(User user, RankRequirements requirements) {
        // Проверяем опыт
        if (user.getExperience() < requirements.getRequiredExperience()) {
            return false;
        }
        
        // Проверяем обязательную миссию
        if (requirements.getRequiredMissionName() != null && !requirements.getRequiredMissionName().isEmpty()) {
            boolean missionCompleted = userMissionRepository.findByUserId(user.getId())
                    .stream()
                    .anyMatch(userMission -> 
                        userMission.getMission().getName().equals(requirements.getRequiredMissionName()) &&
                        userMission.getStatus().name().equals("COMPLETED"));
            
            if (!missionCompleted) {
                return false;
            }
        }
        
        // Проверяем очки в компетенциях
        if (requirements.getRequiredCompetencyPoints() != null && requirements.getRequiredCompetencyPoints() > 0) {
            List<UserCompetency> userCompetencies = userCompetencyRepository.findByUserId(user.getId());
            
            // Проверяем, есть ли компетенции с достаточным количеством очков
            boolean hasEnoughPoints = userCompetencies.stream()
                    .anyMatch(uc -> uc.getExperiencePoints() >= requirements.getRequiredCompetencyPoints());
            
            if (!hasEnoughPoints) {
                return false;
            }
        }
        
        return true;
    }
}
