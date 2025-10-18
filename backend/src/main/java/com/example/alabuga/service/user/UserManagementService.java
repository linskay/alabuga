package com.example.alabuga.service.user;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.alabuga.dto.UserCreateDTO;
import com.example.alabuga.dto.UserDTO;
import com.example.alabuga.dto.UserUpdateDTO;
import com.example.alabuga.entity.Rank;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserRole;
import com.example.alabuga.exception.DuplicateResourceException;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.UserMapper;
import com.example.alabuga.repository.UserRepository;
import com.example.alabuga.service.NotificationService;

import lombok.RequiredArgsConstructor;

/**
 * Сервис для управления пользователями (CRUD операции)
 * Отвечает только за базовые операции с пользователями
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final NotificationService notificationService;
    private final UserCompetencyService userCompetencyService;

    // ========== USER MANAGEMENT OPERATIONS ==========

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
        userCompetencyService.addAllCompetenciesToUser(savedUser.getId());

        // Создаем уведомление о присвоении начального ранга
        Rank initialRank = Rank.fromLevel(savedUser.getRank());
        notificationService.createRankAssignmentNotification(savedUser, initialRank);

        return userMapper.toDTO(savedUser);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", id));

        Integer oldRank = user.getRank();

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
}
