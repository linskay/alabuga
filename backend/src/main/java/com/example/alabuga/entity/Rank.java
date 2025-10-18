package com.example.alabuga.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Schema(description = "Ранги космических специалистов")
@Getter
@RequiredArgsConstructor
public enum Rank {
    
    // ========== ДОК ЛУННОЙ СТАНЦИИ (Ветка 1) - Ранги 1-5 ==========
    @Schema(description = "Космо-Кадет - стартовый ранг")
    COSMO_CADET(1, "Космо-Кадет", "Общий старт для всех космических специалистов", RankBranch.LUNAR_DOCK),
    
    @Schema(description = "Специалист Дока - ранг 2")
    DOCK_SPECIALIST(2, "Специалист Дока", "Специалист лунной станции", RankBranch.LUNAR_DOCK),
    
    @Schema(description = "Мастер Дока - ранг 3")
    DOCK_MASTER(3, "Мастер Дока", "Мастер лунной станции", RankBranch.LUNAR_DOCK),
    
    @Schema(description = "Командир Дока - ранг 4")
    DOCK_COMMANDER(4, "Командир Дока", "Командир лунной станции", RankBranch.LUNAR_DOCK),
    
    @Schema(description = "Хранитель Дока - ранг 5")
    DOCK_KEEPER(5, "Хранитель Дока", "Хранитель лунной станции", RankBranch.LUNAR_DOCK),
    
    // ========== АНАЛИТИКО-ТЕХНИЧЕСКАЯ ВЕТКА - Ранги 2-4 ==========
    @Schema(description = "Навигатор Траекторий - аналитико-техническая ветка, ранг 2")
    TRAJECTORY_NAVIGATOR(2, "Навигатор Траекторий", "Специалист по расчету космических траекторий", RankBranch.ANALYTICAL_TECHNICAL),
    
    @Schema(description = "Аналитик Орбит - аналитико-техническая ветка, ранг 3")
    ORBIT_ANALYST(3, "Аналитик Орбит", "Эксперт по анализу орбитальных систем", RankBranch.ANALYTICAL_TECHNICAL),
    
    @Schema(description = "Архитектор Станции - аналитико-техническая ветка, ранг 4")
    STATION_ARCHITECT(4, "Архитектор Станции", "Мастер проектирования космических станций", RankBranch.ANALYTICAL_TECHNICAL),
    
    // ========== ГУМАНИТАРНО-ИССЛЕДОВАТЕЛЬСКАЯ ВЕТКА - Ранги 2-4 ==========
    @Schema(description = "Хронист Галактики - гуманитарно-исследовательская ветка, ранг 2")
    GALAXY_CHRONICLER(2, "Хронист Галактики", "Летописец космических событий и истории", RankBranch.HUMANITARIAN_RESEARCH),
    
    @Schema(description = "Исследователь Культур - гуманитарно-исследовательская ветка, ранг 3")
    CULTURE_RESEARCHER(3, "Исследователь Культур", "Изучатель инопланетных цивилизаций", RankBranch.HUMANITARIAN_RESEARCH),
    
    @Schema(description = "Мастер Лектория - гуманитарно-исследовательская ветка, ранг 4")
    LECTURE_MASTER(4, "Мастер Лектория", "Преподаватель космических наук", RankBranch.HUMANITARIAN_RESEARCH),
    
    // ========== КОММУНИКАЦИОННО-ЛИДЕРСКАЯ ВЕТКА - Ранги 2-4 ==========
    @Schema(description = "Связист Звёздного Флота - коммуникационно-лидерская ветка, ранг 2")
    STARFLEET_COMMUNICATOR(2, "Связист Звёздного Флота", "Специалист по межзвездной связи", RankBranch.COMMUNICATION_LEADERSHIP),
    
    @Schema(description = "Штурман Экипажа - коммуникационно-лидерская ветка, ранг 3")
    CREW_NAVIGATOR(3, "Штурман Экипажа", "Лидер навигационной команды", RankBranch.COMMUNICATION_LEADERSHIP),
    
    @Schema(description = "Командир Отряда - коммуникационно-лидерская ветка, ранг 4")
    SQUAD_COMMANDER(4, "Командир Отряда", "Командир космического отряда", RankBranch.COMMUNICATION_LEADERSHIP),
    
    // ========== ФИНАЛЬНЫЙ РАНГ - Ранг 5 ==========
    @Schema(description = "Хранитель Станции - финальный ранг")
    STATION_KEEPER(5, "Хранитель Станции «Алабуга.TECH»", "Высший ранг космического специалиста", RankBranch.FINAL);
    
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
    
    /**
     * Получить ранг по уровню и ветке
     */
    public static Rank fromLevelAndBranch(Integer level, RankBranch branch) {
        for (Rank rank : values()) {
            if (rank.getLevel().equals(level) && rank.getBranch() == branch) {
                return rank;
            }
        }
        return COSMO_CADET; // По умолчанию
    }
    
    /**
     * Получить все ранги для определенной ветки
     */
    public static java.util.List<Rank> getRanksByBranch(RankBranch branch) {
        return java.util.Arrays.stream(values())
                .filter(rank -> rank.getBranch() == branch)
                .sorted((r1, r2) -> r1.getLevel().compareTo(r2.getLevel()))
                .toList();
    }
    
    /**
     * Получить все ранги для определенного уровня
     */
    public static java.util.List<Rank> getRanksByLevel(Integer level) {
        return java.util.Arrays.stream(values())
                .filter(rank -> rank.getLevel().equals(level))
                .toList();
    }
    
    @Schema(description = "Ветки развития рангов")
    @Getter
    @RequiredArgsConstructor
    public enum RankBranch {
        @Schema(description = "Док Лунной Станции - стартовая ветка")
        LUNAR_DOCK("Док Лунной Станции"),
        
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