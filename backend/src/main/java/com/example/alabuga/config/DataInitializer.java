package com.example.alabuga.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final CompetencyRepository competencyRepository;
    private final ArtifactRepository artifactRepository;
    private final UserCompetencyRepository userCompetencyRepository;
    private final UserArtifactRepository userArtifactRepository;
    
    
    @Override
    public void run(String... args) throws Exception {
        log.info("Инициализация тестовых данных...");

        createArtifacts();
 
        createUsers();
     
        addAllCompetenciesToExistingUsers();
        
        // Обновляем существующие компетенции с тестовыми данными
        updateExistingUserCompetencies();
        
        linkUsersWithArtifacts();
        
        log.info("Тестовые данные успешно созданы!");
    }
    
    
    private void createArtifacts() {
        if (artifactRepository.count() == 0) {
            log.info("Создание артефактов...");
            
            Artifact sword = Artifact.builder()
                    .name("Меч Звёздного Воина")
                    .shortDescription("За успешное завершение миссии приведи друга")
                    .rarity(Artifact.ArtifactRarity.LEGENDARY)
                    .isActive(true)
                    .build();
            artifactRepository.save(sword);
            
            Artifact shield = Artifact.builder()
                    .name("Щит Галактического Защитника")
                    .shortDescription("Защищает от космических угроз")
                    .rarity(Artifact.ArtifactRarity.EPIC)
                    .isActive(true)
                    .build();
            artifactRepository.save(shield);
            
            Artifact ring = Artifact.builder()
                    .name("Кольцо Навигатора")
                    .shortDescription("Улучшает ориентацию в космосе")
                    .rarity(Artifact.ArtifactRarity.RARE)
                    .isActive(true)
                    .build();
            artifactRepository.save(ring);
            
            Artifact potion = Artifact.builder()
                    .name("Энергетический Концентрат")
                    .shortDescription("Восстанавливает энергию космонавта")
                    .rarity(Artifact.ArtifactRarity.COMMON)
                    .isActive(true)
                    .build();
            artifactRepository.save(potion);
            
            Artifact staff = Artifact.builder()
                    .name("Посох Космического Архитектора")
                    .shortDescription("Помогает проектировать космические станции")
                    .rarity(Artifact.ArtifactRarity.EPIC)
                    .isActive(true)
                    .build();
            artifactRepository.save(staff);
        }
    }
    
    private void createUsers() {
        if (userRepository.count() == 0) {
            log.info("Создание пользователей...");
            
            User admin = User.builder()
                    .login("commander")
                    .email("commander@alabuga.com")
                    .passwordHash("admin123")
                    .firstName("Командир")
                    .lastName("Звёздного Флота")
                    .role(UserRole.HR)
                    .experience(5000)
                    .mana(200)
                    .rank(5)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            
            User organizer = User.builder()
                    .login("coordinator")
                    .email("coordinator@alabuga.com")
                    .passwordHash("org123")
                    .firstName("Координатор")
                    .lastName("Миссий")
                    .role(UserRole.ORGANIZER)
                    .experience(3000)
                    .mana(150)
                    .rank(3)
                    .isActive(true)
                    .build();
            userRepository.save(organizer);
            
            User developer = User.builder()
                    .login("pilot")
                    .email("pilot@alabuga.com")
                    .passwordHash("dev123")
                    .firstName("Пилот")
                    .lastName("Космического Корабля")
                    .role(UserRole.USER)
                    .experience(1500)
                    .mana(100)
                    .rank(2)
                    .isActive(true)
                    .build();
            userRepository.save(developer);
            
            User frontendDev = User.builder()
                    .login("navigator")
                    .email("navigator@alabuga.com")
                    .passwordHash("front123")
                    .firstName("Навигатор")
                    .lastName("Галактики")
                    .role(UserRole.USER)
                    .experience(800)
                    .mana(80)
                    .rank(1)
                    .isActive(true)
                    .build();
            userRepository.save(frontendDev);
            
            User juniorDev = User.builder()
                    .login("cadet")
                    .email("cadet@alabuga.com")
                    .firstName("Кадет")
                    .lastName("Академии")
                    .role(UserRole.USER)
                    .experience(200)
                    .mana(50)
                    .rank(1)
                    .isActive(true)
                    .build();
            userRepository.save(juniorDev);
        }
    }
    
    private void addAllCompetenciesToExistingUsers() {
        log.info("Добавление всех компетенций существующим пользователям...");
        
        List<User> allUsers = userRepository.findAll();
        List<Competency> allCompetencies = competencyRepository.findByIsActive(true);
        
        for (User user : allUsers) {
            for (Competency competency : allCompetencies) {
                // Проверяем, есть ли уже такая компетенция у пользователя
                boolean exists = userCompetencyRepository.findByUserIdAndCompetencyId(user.getId(), competency.getId()).isPresent();
                
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
    }
    
    private void updateExistingUserCompetencies() {
        log.info("Обновление существующих компетенций пользователей с тестовыми данными...");
        
        // Получаем пользователей
        User admin = userRepository.findByLogin("commander").orElse(null);
        User organizer = userRepository.findByLogin("coordinator").orElse(null);
        User developer = userRepository.findByLogin("pilot").orElse(null);
        User frontendDev = userRepository.findByLogin("navigator").orElse(null);
        User juniorDev = userRepository.findByLogin("cadet").orElse(null);
        
        // Получаем компетенции
        Competency missionPowerComp = competencyRepository.findByNameContainingIgnoreCase("Сила Миссии").stream().findFirst().orElse(null);
        Competency breakthroughImpulseComp = competencyRepository.findByNameContainingIgnoreCase("Импульс Прорыва").stream().findFirst().orElse(null);
        Competency communicationChannelComp = competencyRepository.findByNameContainingIgnoreCase("Канал Связи").stream().findFirst().orElse(null);
        Competency analyticsModuleComp = competencyRepository.findByNameContainingIgnoreCase("Модуль Аналитики").stream().findFirst().orElse(null);
        Competency commandConsoleComp = competencyRepository.findByNameContainingIgnoreCase("Пульт Командования").stream().findFirst().orElse(null);
        
        // Обновляем компетенции админа
        if (admin != null && missionPowerComp != null) {
            updateUserCompetency(admin.getId(), missionPowerComp.getId(), 450);
        }
        if (admin != null && commandConsoleComp != null) {
            updateUserCompetency(admin.getId(), commandConsoleComp.getId(), 400);
        }
        
        // Обновляем компетенции организатора
        if (organizer != null && commandConsoleComp != null) {
            updateUserCompetency(organizer.getId(), commandConsoleComp.getId(), 350);
        }
        if (organizer != null && communicationChannelComp != null) {
            updateUserCompetency(organizer.getId(), communicationChannelComp.getId(), 300);
        }
        
        // Обновляем компетенции разработчика
        if (developer != null && analyticsModuleComp != null) {
            updateUserCompetency(developer.getId(), analyticsModuleComp.getId(), 250);
        }
        if (developer != null && breakthroughImpulseComp != null) {
            updateUserCompetency(developer.getId(), breakthroughImpulseComp.getId(), 200);
        }
        
        // Обновляем компетенции фронтенд разработчика
        if (frontendDev != null && breakthroughImpulseComp != null) {
            updateUserCompetency(frontendDev.getId(), breakthroughImpulseComp.getId(), 150);
        }
        
        // Обновляем компетенции джуниора
        if (juniorDev != null && missionPowerComp != null) {
            updateUserCompetency(juniorDev.getId(), missionPowerComp.getId(), 50);
        }
    }
    
    private void updateUserCompetency(Long userId, Long competencyId, Integer experiencePoints) {
        userCompetencyRepository.findByUserIdAndCompetencyId(userId, competencyId)
                .ifPresent(userCompetency -> {
                    userCompetency.setExperiencePoints(experiencePoints);
                    userCompetencyRepository.save(userCompetency);
                });
    }
    
    private void linkUsersWithArtifacts() {
        log.info("Связывание пользователей с артефактами...");
        
        // Получаем пользователей
        User admin = userRepository.findByLogin("commander").orElse(null);
        User developer = userRepository.findByLogin("pilot").orElse(null);
        User frontendDev = userRepository.findByLogin("navigator").orElse(null);
        User juniorDev = userRepository.findByLogin("cadet").orElse(null);
        
        // Получаем артефакты
        Artifact sword = artifactRepository.findByNameContainingIgnoreCase("Меч Звёздного").stream().findFirst().orElse(null);
        Artifact shield = artifactRepository.findByNameContainingIgnoreCase("Щит Галактического").stream().findFirst().orElse(null);
        Artifact ring = artifactRepository.findByNameContainingIgnoreCase("Кольцо Навигатора").stream().findFirst().orElse(null);
        Artifact potion = artifactRepository.findByNameContainingIgnoreCase("Энергетический").stream().findFirst().orElse(null);
        Artifact staff = artifactRepository.findByNameContainingIgnoreCase("Посох Космического").stream().findFirst().orElse(null);
        
        // Связываем космонавтов с артефактами
        if (admin != null && sword != null) {
            UserArtifact commanderSword = UserArtifact.builder()
                    .user(admin)
                    .artifact(sword)
                    .acquiredAt(java.time.LocalDateTime.now())
                    .isEquipped(true)
                    .build();
            userArtifactRepository.save(commanderSword);
        }
        
        if (developer != null && shield != null) {
            UserArtifact pilotShield = UserArtifact.builder()
                    .user(developer)
                    .artifact(shield)
                    .acquiredAt(java.time.LocalDateTime.now())
                    .isEquipped(true)
                    .build();
            userArtifactRepository.save(pilotShield);
        }
        
        if (frontendDev != null && ring != null) {
            UserArtifact navigatorRing = UserArtifact.builder()
                    .user(frontendDev)
                    .artifact(ring)
                    .acquiredAt(java.time.LocalDateTime.now())
                    .isEquipped(false)
                    .build();
            userArtifactRepository.save(navigatorRing);
        }
        
        if (juniorDev != null && potion != null) {
            UserArtifact cadetPotion = UserArtifact.builder()
                    .user(juniorDev)
                    .artifact(potion)
                    .acquiredAt(java.time.LocalDateTime.now())
                    .isEquipped(true)
                    .build();
            userArtifactRepository.save(cadetPotion);
        }
    }
}
