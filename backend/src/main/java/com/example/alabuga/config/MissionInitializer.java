package com.example.alabuga.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.alabuga.entity.Mission;
import com.example.alabuga.entity.MissionDifficulty;
import com.example.alabuga.entity.MissionType;
import com.example.alabuga.repository.MissionRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MissionInitializer implements CommandLineRunner {
    
    private final MissionRepository missionRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (missionRepository.count() == 0) {
            initializeMissions();
        }
    }
    
    private void initializeMissions() {
        List<Mission> missions = List.of(
            // Док Лунной Базы - базовые квесты
            Mission.builder()
                .name("Первые шаги в космосе")
                .description("Изучите основы космических путешествий и заполните анкету космонавта")
                .branchId(1L)
                .type(MissionType.QUEST)
                .difficulty(MissionDifficulty.EASY)
                .experienceReward(50)
                .manaReward(25)
                .requiredCompetencies("[]")
                .isActive(true)
                .build(),
                
            Mission.builder()
                .name("Знакомство с базой")
                .description("Пройдите экскурсию по лунной базе и изучите основные системы")
                .branchId(1L)
                .type(MissionType.QUEST)
                .difficulty(MissionDifficulty.EASY)
                .experienceReward(75)
                .manaReward(30)
                .requiredCompetencies("[]")
                .isActive(true)
                .build(),
                
            // Кольцо Посланцев - привлечение новых
            Mission.builder()
                .name("Пригласите друга")
                .description("Пригласите нового участника в космическую программу")
                .branchId(2L)
                .type(MissionType.CHALLENGE)
                .difficulty(MissionDifficulty.MEDIUM)
                .experienceReward(100)
                .manaReward(50)
                .requiredCompetencies("[\"communication\"]")
                .isActive(true)
                .build(),
                
            Mission.builder()
                .name("Создайте пост о космосе")
                .description("Напишите интересный пост о космических исследованиях")
                .branchId(2L)
                .type(MissionType.QUEST)
                .difficulty(MissionDifficulty.MEDIUM)
                .experienceReward(80)
                .manaReward(40)
                .requiredCompetencies("[\"communication\", \"creativity\"]")
                .isActive(true)
                .build(),
                
            // Академия Звёздного Флота - обучение
            Mission.builder()
                .name("Основы навигации")
                .description("Изучите принципы космической навигации и пройдите тест")
                .branchId(3L)
                .type(MissionType.TEST)
                .difficulty(MissionDifficulty.MEDIUM)
                .experienceReward(120)
                .manaReward(60)
                .requiredCompetencies("[\"navigation\"]")
                .isActive(true)
                .build(),
                
            Mission.builder()
                .name("Инженерия космических кораблей")
                .description("Изучите основы конструирования космических аппаратов")
                .branchId(3L)
                .type(MissionType.TEST)
                .difficulty(MissionDifficulty.HARD)
                .experienceReward(150)
                .manaReward(75)
                .requiredCompetencies("[\"engineering\", \"science\"]")
                .isActive(true)
                .build(),
                
            // Пояс Испытаний - симуляции и челленджи
            Mission.builder()
                .name("Симуляция полета")
                .description("Проведите виртуальный полет к Марсу")
                .branchId(4L)
                .type(MissionType.SIMULATION)
                .difficulty(MissionDifficulty.HARD)
                .experienceReward(200)
                .manaReward(100)
                .requiredCompetencies("[\"navigation\", \"engineering\", \"science\"]")
                .isActive(true)
                .build(),
                
            Mission.builder()
                .name("Экстренная посадка")
                .description("Симуляция экстренной посадки на неизвестной планете")
                .branchId(4L)
                .type(MissionType.SIMULATION)
                .difficulty(MissionDifficulty.EXPERT)
                .experienceReward(300)
                .manaReward(150)
                .requiredCompetencies("[\"navigation\", \"engineering\", \"science\", \"problem_solving\"]")
                .isActive(true)
                .build()
        );
        
        missionRepository.saveAll(missions);
    }
}
