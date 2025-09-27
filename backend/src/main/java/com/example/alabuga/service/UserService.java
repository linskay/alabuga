package com.example.alabuga.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.ArtifactDTO;
import com.example.alabuga.dto.CompetencyDTO;
import com.example.alabuga.dto.UserArtifactDTO;
import com.example.alabuga.dto.UserCompetencyDTO;
import com.example.alabuga.dto.UserCreateDTO;
import com.example.alabuga.dto.UserDTO;
import com.example.alabuga.dto.UserMissionDTO;
import com.example.alabuga.dto.UserUpdateDTO;
import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.Competency;
import com.example.alabuga.entity.Mission;
import com.example.alabuga.entity.Rank;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserArtifact;
import com.example.alabuga.entity.UserCompetency;
import com.example.alabuga.entity.UserMission;
import com.example.alabuga.entity.UserRole;
import com.example.alabuga.exception.BusinessLogicException;
import com.example.alabuga.exception.DuplicateResourceException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.ArtifactMapper;
import com.example.alabuga.mapper.CompetencyMapper;
import com.example.alabuga.mapper.UserArtifactMapper;
import com.example.alabuga.mapper.UserMapper;
import com.example.alabuga.repository.ArtifactRepository;
import com.example.alabuga.repository.CompetencyRepository;
import com.example.alabuga.repository.MissionRepository;
import com.example.alabuga.repository.UserArtifactRepository;
import com.example.alabuga.repository.UserCompetencyRepository;
import com.example.alabuga.repository.UserMissionRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final CompetencyRepository competencyRepository;
    private final ArtifactRepository artifactRepository;
    private final UserCompetencyRepository userCompetencyRepository;
    private final UserArtifactRepository userArtifactRepository;
    private final UserMissionRepository userMissionRepository;
    private final MissionRepository missionRepository;
    private final UserMapper userMapper;
    private final CompetencyMapper competencyMapper;
    private final ArtifactMapper artifactMapper;
    private final NotificationService notificationService;
    private final UserArtifactMapper userArtifactMapper;
    
  
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toDTOList(users);
    }
    
    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDTO);
    }
    
    public Optional<UserDTO> getUserByLogin(String login) {
        return userRepository.findByLogin(login)
                .map(userMapper::toDTO);
    }
    
    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toDTO);
    }
    
    @Transactional
    public UserDTO createUser(UserCreateDTO userCreateDTO) {
        // Проверяем уникальность логина и email
        if (userRepository.existsByLogin(userCreateDTO.getLogin())) {
            throw new DuplicateResourceException("Пользователь", "логином", userCreateDTO.getLogin());
        }
        if (userRepository.existsByEmail(userCreateDTO.getEmail())) {
            throw new DuplicateResourceException("Пользователь", "email", userCreateDTO.getEmail());
        }
        
        User user = userMapper.toEntity(userCreateDTO);
        User savedUser = userRepository.save(user);
        
        // Добавляем все компетенции новому пользователю
        addAllCompetenciesToUser(savedUser.getId());
        
        // Создаем уведомление о присвоении начального ранга
        Rank initialRank = Rank.fromLevel(savedUser.getRank());
        notificationService.createRankAssignmentNotification(savedUser, initialRank);
        
        return userMapper.toDTO(savedUser);
    }
    
    @Transactional
    public UserDTO updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", id));
        
        // Проверяем уникальность логина и email (если они изменились)
        if (userUpdateDTO.getLogin() != null && !user.getLogin().equals(userUpdateDTO.getLogin()) && 
            userRepository.existsByLogin(userUpdateDTO.getLogin())) {
            throw new DuplicateResourceException("Пользователь", "логином", userUpdateDTO.getLogin());
        }
        if (userUpdateDTO.getEmail() != null && !user.getEmail().equals(userUpdateDTO.getEmail()) && 
            userRepository.existsByEmail(userUpdateDTO.getEmail())) {
            throw new DuplicateResourceException("Пользователь", "email", userUpdateDTO.getEmail());
        }
        
        // Обновляем поля через маппер
        userMapper.updateEntity(user, userUpdateDTO);
        
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", id));
        
        userRepository.delete(user);
    }
    
    @Transactional
    public UserDTO deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", id));
        
        user.setIsActive(false);
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }
    
    // ========== SEARCH OPERATIONS ==========
    
    public List<UserDTO> searchUsersByName(String name) {
        List<User> users = userRepository.findByNameContaining(name);
        return userMapper.toDTOList(users);
    }
    
    public List<UserDTO> getUsersByRole(UserRole role) {
        List<User> users = userRepository.findByRole(role);
        return userMapper.toDTOList(users);
    }
    
    public List<UserDTO> getActiveUsers() {
        List<User> users = userRepository.findByIsActive(true);
        return userMapper.toDTOList(users);
    }
    
    public List<UserDTO> getUsersByMinRank(Integer minRank) {
        List<User> users = userRepository.findByRankGreaterThanEqualOrderByRankDesc(minRank);
        return userMapper.toDTOList(users);
    }
    
    public List<UserDTO> getUsersByMinExperience(Integer minExperience) {
        List<User> users = userRepository.findByExperienceGreaterThanEqualOrderByExperienceDesc(minExperience);
        return userMapper.toDTOList(users);
    }
    
    // ========== USER STATS OPERATIONS ==========
    
    @Transactional
    public UserDTO addExperience(Long userId, Integer experience) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        user.setExperience(user.getExperience() + experience);
        
        // Обновляем ранг на основе опыта (каждые 1000 опыта = +1 ранг)
        int newRank = (user.getExperience() / 1000) + 1;
        user.setRank(newRank);
        
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
        Optional<UserCompetency> existingCompetency = userCompetencyRepository.findByUserIdAndCompetencyId(userId, competencyId);
        if (existingCompetency.isPresent()) {
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
    
    // ========== ARTIFACT OPERATIONS ==========
    
    public List<ArtifactDTO> getAllArtifacts() {
        List<Artifact> artifacts = artifactRepository.findByIsActive(true);
        return artifactMapper.toDTOList(artifacts);
    }
    
    public List<UserArtifactDTO> getUserArtifacts(Long userId) {
        List<UserArtifact> userArtifacts = userArtifactRepository.findByUserId(userId);
        return userArtifactMapper.toDTOList(userArtifacts);
    }
    
    @Transactional
    public UserArtifactDTO addUserArtifact(Long userId, Long artifactId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", userId));
        
        Artifact artifact = artifactRepository.findById(artifactId)
                .orElseThrow(() -> new ResourceNotFoundException("Артефакт", artifactId));
        
        // Проверяем, есть ли уже у пользователя этот артефакт
        if (userArtifactRepository.existsByUserIdAndArtifactId(userId, artifactId)) {
            throw new BusinessLogicException("У пользователя уже есть этот артефакт");
        }
        
        UserArtifact userArtifact = UserArtifact.builder()
                .user(user)
                .artifact(artifact)
                .isEquipped(false)
                .build();
        
        UserArtifact saved = userArtifactRepository.save(userArtifact);
        return userArtifactMapper.toDTO(saved);
    }
    
    @Transactional
    public UserArtifactDTO equipArtifact(Long userId, Long artifactId) {
        try {
            UserArtifact userArtifact = userArtifactRepository.findByUserIdAndArtifactId(userId, artifactId);
            if (userArtifact == null) {
                throw new BusinessLogicException("У пользователя нет этого артефакта");
            }
            
            // Проверяем лимит экипированных артефактов
            long equippedCount = userArtifactRepository.countEquippedArtifactsByUserId(userId);
            if (!userArtifact.getIsEquipped() && equippedCount >= 3) {
                throw new BusinessLogicException("Можно экипировать максимум 3 артефакта");
            }
            
            userArtifact.setIsEquipped(!userArtifact.getIsEquipped());
            UserArtifact saved = userArtifactRepository.save(userArtifact);
            return userArtifactMapper.toDTO(saved);
        } catch (Exception e) {
            System.err.println("Error in equipArtifact: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional
    public UserArtifactDTO unequipArtifact(Long userId, Long artifactId) {
        UserArtifact userArtifact = userArtifactRepository.findByUserIdAndArtifactId(userId, artifactId);
        if (userArtifact == null) {
            throw new BusinessLogicException("У пользователя нет этого артефакта");
        }
        
        userArtifact.setIsEquipped(false);
        UserArtifact saved = userArtifactRepository.save(userArtifact);
        return userArtifactMapper.toDTO(saved);
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
    
    // ========== MISSION OPERATIONS ==========
    
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
                .status(com.example.alabuga.entity.MissionStatus.IN_PROGRESS)
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
