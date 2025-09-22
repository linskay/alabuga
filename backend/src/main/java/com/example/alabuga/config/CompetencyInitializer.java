package com.example.alabuga.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.alabuga.entity.Competency;
import com.example.alabuga.repository.CompetencyRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CompetencyInitializer implements CommandLineRunner {
    
    private final CompetencyRepository competencyRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (competencyRepository.count() == 0) {
            initializeCompetencies();
        }
    }
    
    private void initializeCompetencies() {
        List<Competency> competencies = List.of(
            Competency.builder()
                .name("Сила Миссии")
                .shortDescription("Вера в дело")
                .description("Умение держать курс даже тогда, когда звёзды гаснут. Показывает преданность цели и устойчивость в испытаниях.")
                .isActive(true)
                .build(),
                
            Competency.builder()
                .name("Импульс Прорыва")
                .shortDescription("Стремление к большему")
                .description("Энергия, которая двигает вперёд. Чем выше импульс, тем быстрее игрок берётся за новые вызовы.")
                .isActive(true)
                .build(),
                
            Competency.builder()
                .name("Канал Связи")
                .shortDescription("Общение")
                .description("Умение устанавливать контакт с экипажем и внешними станциями. Хорошая прокачка = сильные коммуникации.")
                .isActive(true)
                .build(),
                
            Competency.builder()
                .name("Модуль Аналитики")
                .shortDescription("Аналитика")
                .description("Навык считывать данные и находить решения даже в хаосе. Чем выше уровень — тем точнее расчёты и прогнозы.")
                .isActive(true)
                .build(),
                
            Competency.builder()
                .name("Пульт Командования")
                .shortDescription("Командование")
                .description("Способность управлять экипажем. Навык проявляется в умении принимать решения и вести команду сквозь метеоритные поля.")
                .isActive(true)
                .build(),
                
            Competency.builder()
                .name("Кодекс Звёздного Права")
                .shortDescription("Юриспруденция")
                .description("Знание законов и правил межзвёздного пространства. Чем выше навык — тем меньше штрафов и ошибок в документах.")
                .isActive(true)
                .build(),
                
            Competency.builder()
                .name("Голограммное Мышление")
                .shortDescription("Трёхмерное мышление")
                .description("Видеть ситуацию сразу в нескольких измерениях. Навык стратегов и проектировщиков.")
                .isActive(true)
                .build(),
                
            Competency.builder()
                .name("Кредитный Поток")
                .shortDescription("Базовая экономика")
                .description("Понимание движения ресурсов. Высокий уровень — это умение не сжечь топливо впустую и эффективно управлять финансами.")
                .isActive(true)
                .build(),
                
            Competency.builder()
                .name("Курс Аэронавигации")
                .shortDescription("Основы аэронавигации")
                .description("Базовые знания о маршрутах и манёврах. Отправная точка для будущих пилотов и штурманов.")
                .isActive(true)
                .build()
        );
        
        competencyRepository.saveAll(competencies);
    }
}
