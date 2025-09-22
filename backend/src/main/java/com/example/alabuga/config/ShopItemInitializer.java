package com.example.alabuga.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.alabuga.entity.ShopItem;
import com.example.alabuga.repository.ShopItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ShopItemInitializer implements CommandLineRunner {
    
    private final ShopItemRepository shopItemRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (shopItemRepository.count() == 0) {
            initializeShopItems();
        }
    }
    
    private void initializeShopItems() {
        log.info("Создание товаров для магазина Нексус...");
        
        List<ShopItem> shopItems = List.of(
            // Чертежи
            ShopItem.builder()
                .name("Чертеж Космического Двигателя")
                .description("Позволяет построить мощный двигатель для космических кораблей")
                .price(500)
                .imageUrl("https://example.com/images/blueprint-engine.jpg")
                .isActive(true)
                .stockQuantity(10)
                .build(),
                
            ShopItem.builder()
                .name("Чертеж Навигационной Системы")
                .description("Современная система навигации для точного позиционирования в космосе")
                .price(300)
                .imageUrl("https://example.com/images/blueprint-navigation.jpg")
                .isActive(true)
                .stockQuantity(15)
                .build(),
                
            ShopItem.builder()
                .name("Чертеж Жизнеобеспечения")
                .description("Система жизнеобеспечения для длительных космических миссий")
                .price(400)
                .imageUrl("https://example.com/images/blueprint-life-support.jpg")
                .isActive(true)
                .stockQuantity(8)
                .build(),
                
            // Ресурсы
            ShopItem.builder()
                .name("Энергетические Кристаллы")
                .description("Чистые кристаллы энергии для питания космических систем")
                .price(100)
                .imageUrl("https://example.com/images/energy-crystals.jpg")
                .isActive(true)
                .stockQuantity(null) // Неограниченно
                .build(),
                
            ShopItem.builder()
                .name("Металлические Сплавы")
                .description("Прочные сплавы для строительства космических кораблей")
                .price(150)
                .imageUrl("https://example.com/images/metal-alloys.jpg")
                .isActive(true)
                .stockQuantity(null) // Неограниченно
                .build(),
                
            ShopItem.builder()
                .name("Квантовые Процессоры")
                .description("Высокопроизводительные процессоры для бортовых компьютеров")
                .price(250)
                .imageUrl("https://example.com/images/quantum-processors.jpg")
                .isActive(true)
                .stockQuantity(20)
                .build(),
                
            // Улучшения
            ShopItem.builder()
                .name("Модуль Защиты")
                .description("Улучшенная защита от космических угроз и радиации")
                .price(600)
                .imageUrl("https://example.com/images/shield-module.jpg")
                .isActive(true)
                .stockQuantity(5)
                .build(),
                
            ShopItem.builder()
                .name("Усилитель Связи")
                .description("Мощный усилитель для связи на больших расстояниях")
                .price(350)
                .imageUrl("https://example.com/images/communication-booster.jpg")
                .isActive(true)
                .stockQuantity(12)
                .build(),
                
            // Артефакты
            ShopItem.builder()
                .name("Космический Артефакт")
                .description("Древний артефакт с неизвестными свойствами")
                .price(1000)
                .imageUrl("https://example.com/images/space-artifact.jpg")
                .isActive(true)
                .stockQuantity(3)
                .build(),
                
            ShopItem.builder()
                .name("Звездная Карта")
                .description("Карта с координатами неизведанных миров")
                .price(800)
                .imageUrl("https://example.com/images/star-map.jpg")
                .isActive(true)
                .stockQuantity(7)
                .build()
        );
        
        shopItemRepository.saveAll(shopItems);
        log.info("Товары для магазина Нексус успешно созданы!");
    }
}
