package com.example.alabuga.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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

        createCompetencies();

        createArtifacts();
 
        createUsers();
     
        linkUsersWithCompetenciesAndArtifacts();
        
        log.info("Тестовые данные успешно созданы!");
    }
    
    private void createCompetencies() {
        if (competencyRepository.count() == 0) {
            log.info("Создание компетенций...");
            
            Competency java = Competency.builder()
                    .name("Java Programming")
                    .description("Программирование на Java")
                    .maxLevel(100)
                    .isActive(true)
                    .build();
            competencyRepository.save(java);
            
            Competency spring = Competency.builder()
                    .name("Spring Framework")
                    .description("Работа с Spring Framework")
                    .maxLevel(100)
                    .isActive(true)
                    .build();
            competencyRepository.save(spring);
            
            Competency react = Competency.builder()
                    .name("React Development")
                    .description("Разработка на React")
                    .maxLevel(100)
                    .isActive(true)
                    .build();
            competencyRepository.save(react);
            
            Competency leadership = Competency.builder()
                    .name("Leadership")
                    .description("Лидерские качества")
                    .maxLevel(100)
                    .isActive(true)
                    .build();
            competencyRepository.save(leadership);
            
            Competency communication = Competency.builder()
                    .name("Communication")
                    .description("Коммуникативные навыки")
                    .maxLevel(100)
                    .isActive(true)
                    .build();
            competencyRepository.save(communication);
        }
    }
    
    private void createArtifacts() {
        if (artifactRepository.count() == 0) {
            log.info("Создание артефактов...");
            
            Artifact sword = Artifact.builder()
                    .name("Меч Кодера")
                    .description("Легендарный меч, увеличивающий скорость программирования")
                    .rarity(Artifact.ArtifactRarity.LEGENDARY)
                    .powerLevel(95)
                    .isActive(true)
                    .build();
            artifactRepository.save(sword);
            
            Artifact shield = Artifact.builder()
                    .name("Щит Тестировщика")
                    .description("Защищает от багов и ошибок")
                    .rarity(Artifact.ArtifactRarity.EPIC)
                    .powerLevel(80)
                    .isActive(true)
                    .build();
            artifactRepository.save(shield);
            
            Artifact ring = Artifact.builder()
                    .name("Кольцо Алгоритмов")
                    .description("Улучшает понимание алгоритмов")
                    .rarity(Artifact.ArtifactRarity.RARE)
                    .powerLevel(65)
                    .isActive(true)
                    .build();
            artifactRepository.save(ring);
            
            Artifact potion = Artifact.builder()
                    .name("Зелье Мотивации")
                    .description("Восстанавливает энергию разработчика")
                    .rarity(Artifact.ArtifactRarity.COMMON)
                    .powerLevel(30)
                    .isActive(true)
                    .build();
            artifactRepository.save(potion);
            
            Artifact staff = Artifact.builder()
                    .name("Посох Архитектора")
                    .description("Помогает проектировать системы")
                    .rarity(Artifact.ArtifactRarity.EPIC)
                    .powerLevel(85)
                    .isActive(true)
                    .build();
            artifactRepository.save(staff);
        }
    }
    
    private void createUsers() {
        if (userRepository.count() == 0) {
            log.info("Создание пользователей...");
            
            User admin = User.builder()
                    .login("admin")
                    .email("admin@alabuga.com")
                    .passwordHash("admin123")
                    .firstName("Админ")
                    .lastName("Системы")
                    .role(UserRole.HR)
                    .experience(5000)
                    .mana(200)
                    .rank(5)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            
            User organizer = User.builder()
                    .login("organizer")
                    .email("organizer@alabuga.com")
                    .passwordHash("org123")
                    .firstName("Организатор")
                    .lastName("Событий")
                    .role(UserRole.ORGANIZER)
                    .experience(3000)
                    .mana(150)
                    .rank(3)
                    .isActive(true)
                    .build();
            userRepository.save(organizer);
            
            User developer = User.builder()
                    .login("developer")
                    .email("dev@alabuga.com")
                    .passwordHash("dev123")
                    .firstName("Разработчик")
                    .lastName("Java")
                    .role(UserRole.USER)
                    .experience(1500)
                    .mana(100)
                    .rank(2)
                    .isActive(true)
                    .build();
            userRepository.save(developer);
            
            User frontendDev = User.builder()
                    .login("frontend")
                    .email("frontend@alabuga.com")
                    .passwordHash("front123")
                    .firstName("Фронтенд")
                    .lastName("Разработчик")
                    .role(UserRole.USER)
                    .experience(800)
                    .mana(80)
                    .rank(1)
                    .isActive(true)
                    .build();
            userRepository.save(frontendDev);
            
            User juniorDev = User.builder()
                    .login("junior")
                    .email("junior@alabuga.com")
                    .passwordHash("junior123")
                    .firstName("Джуниор")
                    .lastName("Программист")
                    .role(UserRole.USER)
                    .experience(200)
                    .mana(50)
                    .rank(1)
                    .isActive(true)
                    .build();
            userRepository.save(juniorDev);
        }
    }
    
    private void linkUsersWithCompetenciesAndArtifacts() {
        log.info("Связывание пользователей с компетенциями и артефактами...");
        
        // Получаем пользователей
        var admin = userRepository.findByLogin("admin").orElse(null);
        var organizer = userRepository.findByLogin("organizer").orElse(null);
        var developer = userRepository.findByLogin("developer").orElse(null);
        var frontendDev = userRepository.findByLogin("frontend").orElse(null);
        var juniorDev = userRepository.findByLogin("junior").orElse(null);
        
        // Получаем компетенции
        var javaComp = competencyRepository.findByNameContainingIgnoreCase("Java").stream().findFirst().orElse(null);
        var springComp = competencyRepository.findByNameContainingIgnoreCase("Spring").stream().findFirst().orElse(null);
        var reactComp = competencyRepository.findByNameContainingIgnoreCase("React").stream().findFirst().orElse(null);
        var leadershipComp = competencyRepository.findByNameContainingIgnoreCase("Leadership").stream().findFirst().orElse(null);
        var communicationComp = competencyRepository.findByNameContainingIgnoreCase("Communication").stream().findFirst().orElse(null);
        
        // Получаем артефакты
        var sword = artifactRepository.findByNameContainingIgnoreCase("Меч").stream().findFirst().orElse(null);
        var shield = artifactRepository.findByNameContainingIgnoreCase("Щит").stream().findFirst().orElse(null);
        var ring = artifactRepository.findByNameContainingIgnoreCase("Кольцо").stream().findFirst().orElse(null);
        var potion = artifactRepository.findByNameContainingIgnoreCase("Зелье").stream().findFirst().orElse(null);
        var staff = artifactRepository.findByNameContainingIgnoreCase("Посох").stream().findFirst().orElse(null);
        
        // Связываем админа с компетенциями
        if (admin != null && javaComp != null) {
            UserCompetency adminJava = UserCompetency.builder()
                    .user(admin)
                    .competency(javaComp)
                    .currentLevel(95)
                    .experiencePoints(9500)
                    .build();
            userCompetencyRepository.save(adminJava);
        }
        
        if (admin != null && leadershipComp != null) {
            UserCompetency adminLeadership = UserCompetency.builder()
                    .user(admin)
                    .competency(leadershipComp)
                    .currentLevel(90)
                    .experiencePoints(9000)
                    .build();
            userCompetencyRepository.save(adminLeadership);
        }
        
        // Связываем организатора с компетенциями
        if (organizer != null && leadershipComp != null) {
            UserCompetency orgLeadership = UserCompetency.builder()
                    .user(organizer)
                    .competency(leadershipComp)
                    .currentLevel(85)
                    .experiencePoints(8500)
                    .build();
            userCompetencyRepository.save(orgLeadership);
        }
        
        if (organizer != null && communicationComp != null) {
            UserCompetency orgCommunication = UserCompetency.builder()
                    .user(organizer)
                    .competency(communicationComp)
                    .currentLevel(80)
                    .experiencePoints(8000)
                    .build();
            userCompetencyRepository.save(orgCommunication);
        }
        
        // Связываем разработчика с компетенциями
        if (developer != null && javaComp != null) {
            UserCompetency devJava = UserCompetency.builder()
                    .user(developer)
                    .competency(javaComp)
                    .currentLevel(70)
                    .experiencePoints(7000)
                    .build();
            userCompetencyRepository.save(devJava);
        }
        
        if (developer != null && springComp != null) {
            UserCompetency devSpring = UserCompetency.builder()
                    .user(developer)
                    .competency(springComp)
                    .currentLevel(65)
                    .experiencePoints(6500)
                    .build();
            userCompetencyRepository.save(devSpring);
        }
        
        // Связываем фронтенд разработчика с компетенциями
        if (frontendDev != null && reactComp != null) {
            UserCompetency frontendReact = UserCompetency.builder()
                    .user(frontendDev)
                    .competency(reactComp)
                    .currentLevel(60)
                    .experiencePoints(6000)
                    .build();
            userCompetencyRepository.save(frontendReact);
        }
        
        // Связываем джуниора с компетенциями
        if (juniorDev != null && javaComp != null) {
            UserCompetency juniorJava = UserCompetency.builder()
                    .user(juniorDev)
                    .competency(javaComp)
                    .currentLevel(25)
                    .experiencePoints(2500)
                    .build();
            userCompetencyRepository.save(juniorJava);
        }
        
        // Связываем пользователей с артефактами
        if (admin != null && sword != null) {
            UserArtifact adminSword = UserArtifact.builder()
                    .user(admin)
                    .artifact(sword)
                    .acquiredAt(java.time.LocalDateTime.now())
                    .isEquipped(true)
                    .build();
            userArtifactRepository.save(adminSword);
        }
        
        if (developer != null && shield != null) {
            UserArtifact devShield = UserArtifact.builder()
                    .user(developer)
                    .artifact(shield)
                    .acquiredAt(java.time.LocalDateTime.now())
                    .isEquipped(true)
                    .build();
            userArtifactRepository.save(devShield);
        }
        
        if (frontendDev != null && ring != null) {
            UserArtifact frontendRing = UserArtifact.builder()
                    .user(frontendDev)
                    .artifact(ring)
                    .acquiredAt(java.time.LocalDateTime.now())
                    .isEquipped(false)
                    .build();
            userArtifactRepository.save(frontendRing);
        }
        
        if (juniorDev != null && potion != null) {
            UserArtifact juniorPotion = UserArtifact.builder()
                    .user(juniorDev)
                    .artifact(potion)
                    .acquiredAt(java.time.LocalDateTime.now())
                    .isEquipped(true)
                    .build();
            userArtifactRepository.save(juniorPotion);
        }
    }
}
