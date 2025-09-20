package com.example.alabuga.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Schema(description = "Ранги космических специалистов")
@Getter
@RequiredArgsConstructor
public enum Rank {
    
    // Общий стартовый ранг
    @Schema(description = "Космо-Кадет - общий старт для всех")
    COSMO_CADET(0, "Космо-Кадет", "Общий старт для всех космических специалистов", RankBranch.GENERAL),
    
    // Аналитико-Техническая ветка
    @Schema(description = "Навигатор Траекторий - аналитико-техническая ветка")
    TRAJECTORY_NAVIGATOR(1, "Навигатор Траекторий", "Специалист по расчету космических траекторий", RankBranch.ANALYTICAL_TECHNICAL),
    
    @Schema(description = "Аналитик Орбит - аналитико-техническая ветка")
    ORBIT_ANALYST(2, "Аналитик Орбит", "Эксперт по анализу орбитальных систем", RankBranch.ANALYTICAL_TECHNICAL),
    
    @Schema(description = "Архитектор Станции - аналитико-техническая ветка")
    STATION_ARCHITECT(3, "Архитектор Станции", "Мастер проектирования космических станций", RankBranch.ANALYTICAL_TECHNICAL),
    
    // Гуманитарно-Исследовательская ветка
    @Schema(description = "Хронист Галактики - гуманитарно-исследовательская ветка")
    GALAXY_CHRONICLER(4, "Хронист Галактики", "Летописец космических событий и истории", RankBranch.HUMANITARIAN_RESEARCH),
    
    @Schema(description = "Исследователь Культур - гуманитарно-исследовательская ветка")
    CULTURE_RESEARCHER(5, "Исследователь Культур", "Изучатель инопланетных цивилизаций", RankBranch.HUMANITARIAN_RESEARCH),
    
    @Schema(description = "Мастер Лектория - гуманитарно-исследовательская ветка")
    LECTURE_MASTER(6, "Мастер Лектория", "Преподаватель космических наук", RankBranch.HUMANITARIAN_RESEARCH),
    
    // Коммуникационно-Лидерская ветка
    @Schema(description = "Связист Звёздного Флота - коммуникационно-лидерская ветка")
    STARFLEET_COMMUNICATOR(7, "Связист Звёздного Флота", "Специалист по межзвездной связи", RankBranch.COMMUNICATION_LEADERSHIP),
    
    @Schema(description = "Штурман Экипажа - коммуникационно-лидерская ветка")
    CREW_NAVIGATOR(8, "Штурман Экипажа", "Лидер навигационной команды", RankBranch.COMMUNICATION_LEADERSHIP),
    
    @Schema(description = "Командир Отряда - коммуникационно-лидерская ветка")
    SQUAD_COMMANDER(9, "Командир Отряда", "Командир космического отряда", RankBranch.COMMUNICATION_LEADERSHIP),
    
    // Финальный объединяющий ранг
    @Schema(description = "Хранитель Станции - финальный объединяющий ранг")
    STATION_KEEPER(10, "Хранитель Станции «Алабуга.TECH»", "Высший ранг космического специалиста", RankBranch.FINAL);
    
    private final Integer level;
    private final String name;
    private final String description;
    private final RankBranch branch;
    
    public static Rank fromLevel(Integer level) {
        for (Rank rank : values()) {
            if (rank.getLevel().equals(level)) {
                return rank;
            }
        }
        return COSMO_CADET; // По умолчанию
    }
    
    public static Rank fromName(String name) {
        for (Rank rank : values()) {
            if (rank.getName().equals(name)) {
                return rank;
            }
        }
        return COSMO_CADET; // По умолчанию
    }
    
    @Schema(description = "Ветки развития рангов")
    @Getter
    @RequiredArgsConstructor
    public enum RankBranch {
        @Schema(description = "Общая ветка")
        GENERAL("Общая"),
        
        @Schema(description = "Аналитико-Техническая ветка")
        ANALYTICAL_TECHNICAL("Аналитико-Техническая"),
        
        @Schema(description = "Гуманитарно-Исследовательская ветка")
        HUMANITARIAN_RESEARCH("Гуманитарно-Исследовательская"),
        
        @Schema(description = "Коммуникационно-Лидерская ветка")
        COMMUNICATION_LEADERSHIP("Коммуникационно-Лидерская"),
        
        @Schema(description = "Финальная ветка")
        FINAL("Финальная");
        
        private final String displayName;
    }
}
