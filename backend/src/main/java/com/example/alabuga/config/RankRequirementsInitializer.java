package com.example.alabuga.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.alabuga.entity.RankRequirements;
import com.example.alabuga.repository.RankRequirementsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class RankRequirementsInitializer implements CommandLineRunner {
    
    private final RankRequirementsRepository rankRequirementsRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (rankRequirementsRepository.count() == 0) {
            initializeRankRequirements();
        }
    }
    
    private void initializeRankRequirements() {
        log.info("Создание требований для рангов...");
        
        List<RankRequirements> requirements = List.of(
            // Навигатор Траекторий (уровень 1)
            RankRequirements.builder()
                .rankLevel(1)
                .requiredExperience(500)
                .requiredMissionName("Основы навигации")
                .requiredCompetencyPoints(50)
                .competencyNames("[\"navigation\", \"analytics\"]")
                .description("Требуется выполнить миссию по навигации и набрать 50 очков в компетенциях навигации и аналитики")
                .isActive(true)
                .build(),
                
            // Аналитик Орбит (уровень 2)
            RankRequirements.builder()
                .rankLevel(2)
                .requiredExperience(1000)
                .requiredMissionName("Инженерия космических кораблей")
                .requiredCompetencyPoints(100)
                .competencyNames("[\"navigation\", \"engineering\", \"analytics\"]")
                .description("Требуется выполнить миссию по инженерии и набрать 100 очков в технических компетенциях")
                .isActive(true)
                .build(),
                
            // Архитектор Станции (уровень 3)
            RankRequirements.builder()
                .rankLevel(3)
                .requiredExperience(2000)
                .requiredMissionName("Симуляция полета")
                .requiredCompetencyPoints(200)
                .competencyNames("[\"navigation\", \"engineering\", \"science\", \"problem_solving\"]")
                .description("Требуется выполнить симуляцию полета и набрать 200 очков в технических компетенциях")
                .isActive(true)
                .build(),
                
            // Хронист Галактики (уровень 4)
            RankRequirements.builder()
                .rankLevel(4)
                .requiredExperience(500)
                .requiredMissionName("Создайте пост о космосе")
                .requiredCompetencyPoints(50)
                .competencyNames("[\"communication\", \"creativity\"]")
                .description("Требуется создать пост о космосе и набрать 50 очков в коммуникативных компетенциях")
                .isActive(true)
                .build(),
                
            // Исследователь Культур (уровень 5)
            RankRequirements.builder()
                .rankLevel(5)
                .requiredExperience(1000)
                .requiredMissionName("Пригласите друга")
                .requiredCompetencyPoints(100)
                .competencyNames("[\"communication\", \"creativity\", \"analytics\"]")
                .description("Требуется пригласить друга и набрать 100 очков в исследовательских компетенциях")
                .isActive(true)
                .build(),
                
            // Мастер Лектория (уровень 6)
            RankRequirements.builder()
                .rankLevel(6)
                .requiredExperience(2000)
                .requiredMissionName("Экстренная посадка")
                .requiredCompetencyPoints(200)
                .competencyNames("[\"communication\", \"creativity\", \"analytics\", \"problem_solving\"]")
                .description("Требуется выполнить экстренную посадку и набрать 200 очков в образовательных компетенциях")
                .isActive(true)
                .build(),
                
            // Связист Звёздного Флота (уровень 7)
            RankRequirements.builder()
                .rankLevel(7)
                .requiredExperience(500)
                .requiredMissionName("Знакомство с базой")
                .requiredCompetencyPoints(50)
                .competencyNames("[\"communication\", \"leadership\"]")
                .description("Требуется познакомиться с базой и набрать 50 очков в коммуникативных компетенциях")
                .isActive(true)
                .build(),
                
            // Штурман Экипажа (уровень 8)
            RankRequirements.builder()
                .rankLevel(8)
                .requiredExperience(1000)
                .requiredMissionName("Первые шаги в космосе")
                .requiredCompetencyPoints(100)
                .competencyNames("[\"communication\", \"leadership\", \"navigation\"]")
                .description("Требуется сделать первые шаги в космосе и набрать 100 очков в лидерских компетенциях")
                .isActive(true)
                .build(),
                
            // Командир Отряда (уровень 9)
            RankRequirements.builder()
                .rankLevel(9)
                .requiredExperience(2000)
                .requiredMissionName("Симуляция полета")
                .requiredCompetencyPoints(200)
                .competencyNames("[\"communication\", \"leadership\", \"navigation\", \"problem_solving\"]")
                .description("Требуется выполнить симуляцию полета и набрать 200 очков в командных компетенциях")
                .isActive(true)
                .build(),
                
            // Хранитель Станции (уровень 10) - финальный ранг
            RankRequirements.builder()
                .rankLevel(10)
                .requiredExperience(5000)
                .requiredMissionName("Экстренная посадка")
                .requiredCompetencyPoints(300)
                .competencyNames("[\"navigation\", \"engineering\", \"science\", \"communication\", \"leadership\", \"problem_solving\"]")
                .description("Требуется выполнить экстренную посадку и набрать 300 очков во всех ключевых компетенциях")
                .isActive(true)
                .build()
        );
        
        rankRequirementsRepository.saveAll(requirements);
        log.info("Требования для рангов успешно созданы!");
    }
}
