package com.example.alabuga.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.example.alabuga.entity.Artifact;
import com.example.alabuga.entity.Competency;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserArtifact;
import com.example.alabuga.entity.UserCompetency;
import com.example.alabuga.entity.UserRole;
import com.example.alabuga.repository.ArtifactRepository;
import com.example.alabuga.repository.CompetencyRepository;
import com.example.alabuga.repository.UserArtifactRepository;
import com.example.alabuga.repository.UserCompetencyRepository;
import com.example.alabuga.repository.UserRepository;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final CompetencyRepository competencyRepository;
    private final ArtifactRepository artifactRepository;
    private final UserCompetencyRepository userCompetencyRepository;
    private final UserArtifactRepository userArtifactRepository;
    
  
    public List<User> getAllUsers() {
        log.info("Получение всех пользователей");
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        log.info("Получение пользователя по ID: {}", id);
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByLogin(String login) {
        log.info("Получение пользователя по логину: {}", login);
        return userRepository.findByLogin(login);
    }
    
    public Optional<User> getUserByEmail(String email) {
        log.info("Получение пользователя по email: {}", email);
        return userRepository.findByEmail(email);
    }
    
    @Transactional
    public User createUser(User user) {
        log.info("Создание нового пользователя: {}", user.getLogin());
        
        // Проверяем уникальность логина и email
        if (userRepository.existsByLogin(user.getLogin())) {
            throw new IllegalArgumentException("Пользователь с логином " + user.getLogin() + " уже существует");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Пользователь с email " + user.getEmail() + " уже существует");
        }
        
        return userRepository.save(user);
    }
    
    @Transactional
    public User updateUser(Long id, User userDetails) {
        log.info("Обновление пользователя с ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + id + " не найден"));
        
        // Проверяем уникальность логина и email (если они изменились)
        if (!user.getLogin().equals(userDetails.getLogin()) && 
            userRepository.existsByLogin(userDetails.getLogin())) {
            throw new IllegalArgumentException("Пользователь с логином " + userDetails.getLogin() + " уже существует");
        }
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new IllegalArgumentException("Пользователь с email " + userDetails.getEmail() + " уже существует");
        }
        
        // Обновляем поля
        user.setLogin(userDetails.getLogin());
        user.setEmail(userDetails.getEmail());
        user.setPasswordHash(userDetails.getPasswordHash());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setRole(userDetails.getRole());
        user.setExperience(userDetails.getExperience());
        user.setMana(userDetails.getMana());
        user.setRank(userDetails.getRank());
        user.setIsActive(userDetails.getIsActive());
        
        return userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        log.info("Удаление пользователя с ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + id + " не найден"));
        
        userRepository.delete(user);
    }
    
    @Transactional
    public User deactivateUser(Long id) {
        log.info("Деактивация пользователя с ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + id + " не найден"));
        
        user.setIsActive(false);
        return userRepository.save(user);
    }
    
    // ========== SEARCH OPERATIONS ==========
    
    public List<User> searchUsersByName(String name) {
        log.info("Поиск пользователей по имени: {}", name);
        return userRepository.findByNameContaining(name);
    }
    
    public List<User> getUsersByRole(UserRole role) {
        log.info("Получение пользователей по роли: {}", role);
        return userRepository.findByRole(role);
    }
    
    public List<User> getActiveUsers() {
        log.info("Получение активных пользователей");
        return userRepository.findByIsActive(true);
    }
    
    public List<User> getUsersByMinRank(Integer minRank) {
        log.info("Получение пользователей с рангом >= {}", minRank);
        return userRepository.findByRankGreaterThanEqualOrderByRankDesc(minRank);
    }
    
    public List<User> getUsersByMinExperience(Integer minExperience) {
        log.info("Получение пользователей с опытом >= {}", minExperience);
        return userRepository.findByExperienceGreaterThanEqualOrderByExperienceDesc(minExperience);
    }
    
    // ========== USER STATS OPERATIONS ==========
    
    @Transactional
    public User addExperience(Long userId, Integer experience) {
        log.info("Добавление опыта пользователю {}: {}", userId, experience);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + userId + " не найден"));
        
        user.setExperience(user.getExperience() + experience);
        
        // Обновляем ранг на основе опыта (каждые 1000 опыта = +1 ранг)
        int newRank = (user.getExperience() / 1000) + 1;
        user.setRank(newRank);
        
        return userRepository.save(user);
    }
    
    @Transactional
    public User addMana(Long userId, Integer mana) {
        log.info("Добавление маны пользователю {}: {}", userId, mana);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + userId + " не найден"));
        
        user.setMana(user.getMana() + mana);
        return userRepository.save(user);
    }
    
    @Transactional
    public User spendMana(Long userId, Integer mana) {
        log.info("Трата маны пользователем {}: {}", userId, mana);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + userId + " не найден"));
        
        if (user.getMana() < mana) {
            throw new IllegalArgumentException("Недостаточно маны. Текущая мана: " + user.getMana() + ", требуется: " + mana);
        }
        
        user.setMana(user.getMana() - mana);
        return userRepository.save(user);
    }
    
    // ========== COMPETENCY OPERATIONS ==========
    
    public List<Competency> getAllCompetencies() {
        log.info("Получение всех компетенций");
        return competencyRepository.findByIsActive(true);
    }
    
    public List<UserCompetency> getUserCompetencies(Long userId) {
        log.info("Получение компетенций пользователя: {}", userId);
        return userCompetencyRepository.findByUserId(userId);
    }
    
    @Transactional
    public UserCompetency addUserCompetency(Long userId, Long competencyId, Integer initialLevel) {
        log.info("Добавление компетенции пользователю {}: компетенция {}, уровень {}", userId, competencyId, initialLevel);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + userId + " не найден"));
        
        Competency competency = competencyRepository.findById(competencyId)
                .orElseThrow(() -> new IllegalArgumentException("Компетенция с ID " + competencyId + " не найдена"));
        
        // Проверяем, есть ли уже такая компетенция у пользователя
        Optional<UserCompetency> existingCompetency = userCompetencyRepository.findByUserIdAndCompetencyId(userId, competencyId);
        if (existingCompetency.isPresent()) {
            throw new IllegalArgumentException("У пользователя уже есть компетенция " + competency.getName());
        }
        
        UserCompetency userCompetency = UserCompetency.builder()
                .user(user)
                .competency(competency)
                .currentLevel(initialLevel != null ? initialLevel : 0)
                .experiencePoints(0)
                .build();
        
        return userCompetencyRepository.save(userCompetency);
    }
    
    @Transactional
    public UserCompetency updateCompetencyLevel(Long userId, Long competencyId, Integer newLevel, Integer experiencePoints) {
        log.info("Обновление уровня компетенции пользователя {}: компетенция {}, новый уровень {}", userId, competencyId, newLevel);
        
        UserCompetency userCompetency = userCompetencyRepository.findByUserIdAndCompetencyId(userId, competencyId)
                .orElseThrow(() -> new IllegalArgumentException("Компетенция не найдена у пользователя"));
        
        userCompetency.setCurrentLevel(newLevel);
        if (experiencePoints != null) {
            userCompetency.setExperiencePoints(experiencePoints);
        }
        
        return userCompetencyRepository.save(userCompetency);
    }
    
    // ========== ARTIFACT OPERATIONS ==========
    
    public List<Artifact> getAllArtifacts() {
        log.info("Получение всех артефактов");
        return artifactRepository.findByIsActive(true);
    }
    
    public List<UserArtifact> getUserArtifacts(Long userId) {
        log.info("Получение артефактов пользователя: {}", userId);
        return userArtifactRepository.findByUserId(userId);
    }
    
    @Transactional
    public UserArtifact addUserArtifact(Long userId, Long artifactId) {
        log.info("Добавление артефакта пользователю {}: артефакт {}", userId, artifactId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + userId + " не найден"));
        
        Artifact artifact = artifactRepository.findById(artifactId)
                .orElseThrow(() -> new IllegalArgumentException("Артефакт с ID " + artifactId + " не найден"));
        
        UserArtifact userArtifact = UserArtifact.builder()
                .user(user)
                .artifact(artifact)
                .acquiredAt(LocalDateTime.now())
                .isEquipped(false)
                .build();
        
        return userArtifactRepository.save(userArtifact);
    }
    
    @Transactional
    public UserArtifact equipArtifact(Long userId, Long artifactId) {
        log.info("Экипировка артефакта пользователем {}: артефакт {}", userId, artifactId);
        
        UserArtifact userArtifact = userArtifactRepository.findByUserId(userId).stream()
                .filter(ua -> ua.getArtifact().getId().equals(artifactId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Артефакт не найден у пользователя"));
        
        userArtifact.setIsEquipped(true);
        return userArtifactRepository.save(userArtifact);
    }
    
    @Transactional
    public UserArtifact unequipArtifact(Long userId, Long artifactId) {
        log.info("Снятие артефакта пользователем {}: артефакт {}", userId, artifactId);
        
        UserArtifact userArtifact = userArtifactRepository.findByUserId(userId).stream()
                .filter(ua -> ua.getArtifact().getId().equals(artifactId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Артефакт не найден у пользователя"));
        
        userArtifact.setIsEquipped(false);
        return userArtifactRepository.save(userArtifact);
    }
}
