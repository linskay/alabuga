package com.example.alabuga.entity;

import com.example.alabuga.exception.ResourceNotFoundException;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Schema(description = "Ветка миссий")
@Getter
@RequiredArgsConstructor
public enum MissionBranch {
    @Schema(description = "Док Лунной Базы - базовые квесты")
    LUNAR_DOCK(1L, "Док Лунной Базы", "Базовые квесты", "Базовые квесты для знакомства с системой, заполнения анкет и первых шагов"),
    
    @Schema(description = "Кольцо Посланцев - привлечение новых")
    MESSENGER_RING(2L, "Кольцо Посланцев", "Привлечение новых", "Всё про приглашения, посты, привлечение новых участников и расширение сообщества"),
    
    @Schema(description = "Академия Звёздного Флота - обучение и тесты")
    STARFLEET_ACADEMY(3L, "Академия Звёздного Флота", "Обучение и тесты", "Образовательные программы, тесты, курсы и повышение квалификации"),
    
    @Schema(description = "Пояс Испытаний - симуляции и челленджи")
    TRIAL_BELT(4L, "Пояс Испытаний", "Симуляции и челленджи", "Симуляции, мини-игры, челленджи и практические задания");
    
    private final Long id;
    private final String name;
    private final String shortDescription;
    private final String description;
    
    public static MissionBranch fromId(Long id) {
        for (MissionBranch branch : values()) {
            if (branch.getId().equals(id)) {
                return branch;
            }
        }
        throw new ResourceNotFoundException("Ветка", id);
    }
}