package com.example.alabuga.service;

import com.example.alabuga.dto.NotificationCreateDTO;
import com.example.alabuga.dto.NotificationDTO;
import com.example.alabuga.dto.NotificationUpdateDTO;
import com.example.alabuga.entity.Notification;
import com.example.alabuga.entity.Rank;
import com.example.alabuga.entity.User;
import com.example.alabuga.exception.ResourceNotFoundException;
import com.example.alabuga.mapper.NotificationMapper;
import com.example.alabuga.repository.NotificationRepository;
import com.example.alabuga.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    private final ObjectMapper objectMapper;

    // ========== CRUD OPERATIONS ==========

    public List<NotificationDTO> getUserNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findUserNotificationsOrderedByDate(userId);
        return notificationMapper.toDTOList(notifications);
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        return notificationMapper.toDTOList(notifications);
    }

    public NotificationDTO getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Уведомление", id));
        return notificationMapper.toDTO(notification);
    }

    @Transactional
    public NotificationDTO createNotification(NotificationCreateDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", dto.getUserId()));

        Notification notification = notificationMapper.toEntity(dto);
        notification.setUser(user);

        Notification savedNotification = notificationRepository.save(notification);
        return notificationMapper.toDTO(savedNotification);
    }

    @Transactional
    public NotificationDTO updateNotification(Long id, NotificationUpdateDTO dto) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Уведомление", id));

        notificationMapper.updateEntity(notification, dto);
        Notification savedNotification = notificationRepository.save(notification);
        return notificationMapper.toDTO(savedNotification);
    }

    @Transactional
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Уведомление", id);
        }
        notificationRepository.deleteById(id);
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadNotificationsByUserId(userId);
    }

    @Transactional
    public NotificationDTO markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Уведомление", id));
        notification.setIsRead(true);
        Notification savedNotification = notificationRepository.save(notification);
        return notificationMapper.toDTO(savedNotification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }

    // ========== SYSTEM NOTIFICATIONS ==========

    @Transactional
    public void createRankAssignmentNotification(User user, Rank rank) {
        String title = "СИСТЕМНЫЙ ЖУРНАЛ: ИНИЦИАЦИЯ НОВОГО ЧЛЕНА ЭКИПАЖА";
        String content = generateRankAssignmentContent(rank);
        String metadata = createRankMetadata(rank);

        NotificationCreateDTO dto = NotificationCreateDTO.builder()
                .userId(user.getId())
                .title(title)
                .content(content)
                .notificationType(Notification.NotificationType.RANK_ASSIGNMENT.getCode())
                .metadata(metadata)
                .build();

        createNotification(dto);
    }

    @Transactional
    public void createRankPromotionNotification(User user, Rank oldRank, Rank newRank) {
        String title = "СИСТЕМНЫЙ ЖУРНАЛ: ПОВЫШЕНИЕ РАНГА";
        String content = generateRankPromotionContent(oldRank, newRank);
        String metadata = createRankPromotionMetadata(oldRank, newRank);

        NotificationCreateDTO dto = NotificationCreateDTO.builder()
                .userId(user.getId())
                .title(title)
                .content(content)
                .notificationType(Notification.NotificationType.RANK_PROMOTION.getCode())
                .metadata(metadata)
                .build();

        createNotification(dto);
    }

    @Transactional
    public void createMissionCompletedNotification(User user, String missionName, Integer experienceReward, Integer energyReward) {
        String title = "СИСТЕМНЫЙ ЖУРНАЛ: МИССИЯ ЗАВЕРШЕНА";
        String content = generateMissionCompletedContent(missionName, experienceReward, energyReward);
        String metadata = createMissionMetadata(missionName, experienceReward, energyReward);

        NotificationCreateDTO dto = NotificationCreateDTO.builder()
                .userId(user.getId())
                .title(title)
                .content(content)
                .notificationType(Notification.NotificationType.MISSION_COMPLETED.getCode())
                .metadata(metadata)
                .build();

        createNotification(dto);
    }

    @Transactional
    public void createArtifactAcquiredNotification(User user, String artifactName, String artifactRarity) {
        String title = "СИСТЕМНЫЙ ЖУРНАЛ: АРТЕФАКТ ПОЛУЧЕН";
        String content = generateArtifactAcquiredContent(artifactName, artifactRarity);
        String metadata = createArtifactMetadata(artifactName, artifactRarity);

        NotificationCreateDTO dto = NotificationCreateDTO.builder()
                .userId(user.getId())
                .title(title)
                .content(content)
                .notificationType(Notification.NotificationType.ARTIFACT_ACQUIRED.getCode())
                .metadata(metadata)
                .build();

        createNotification(dto);
    }

    @Transactional
    public void createShopPurchaseNotification(User user, String itemName, Integer price) {
        String title = "СИСТЕМНЫЙ ЖУРНАЛ: ПОКУПКА В НЕКСУСЕ";
        String content = generateShopPurchaseContent(itemName, price);
        String metadata = createShopPurchaseMetadata(itemName, price);

        NotificationCreateDTO dto = NotificationCreateDTO.builder()
                .userId(user.getId())
                .title(title)
                .content(content)
                .notificationType(Notification.NotificationType.SHOP_PURCHASE.getCode())
                .metadata(metadata)
                .build();

        createNotification(dto);
    }

    @Transactional
    public void createCardAcquiredNotification(User user, String cardName, String seriesName) {
        String title = "СИСТЕМНЫЙ ЖУРНАЛ: КАРТА ПОЛУЧЕНА";
        String content = generateCardAcquiredContent(cardName, seriesName);
        String metadata = createCardMetadata(cardName, seriesName);

        NotificationCreateDTO dto = NotificationCreateDTO.builder()
                .userId(user.getId())
                .title(title)
                .content(content)
                .notificationType(Notification.NotificationType.CARD_ACQUIRED.getCode())
                .metadata(metadata)
                .build();

        createNotification(dto);
    }

    // ========== CONTENT GENERATORS ==========

    private String generateRankAssignmentContent(Rank rank) {
        if (rank.getLevel() == 0) {
            return """
                    📨 Сообщение 0: Статус «Космо-Кадет»
                    
                    // АВТОМАТИЧЕСКОЕ УВЕДОМЛЕНИЕ БОРТОВОГО ИИ //
                    ЗАГРУЗКА ПРОТОКОЛА «СТАРТ»...
                    Активен новый член экипажа. Распознан чистый потенциал. Вам присвоен базовый ранг «Космо-Кадет».
                    Ваша задача — общая ориентация в пространстве Флота. Изучайте основы, выполняйте вводные миссии, сканируйте свои врожденные склонности.
                    Система определит ваш уникальный когнитивный паттерн и предложит путь специализации.
                    Удачи, Кадет. Пусть звезды светят вам ярче.
                    """;
        }

        return generateRankSpecificContent(rank);
    }

    private String generateRankPromotionContent(Rank oldRank, Rank newRank) {
        return String.format("""
                        // ПОВЫШЕНИЕ СТАТУСА //
                        Поздравляем с повышением!
                        
                        Предыдущий ранг: %s (уровень %d)
                        Новый ранг: %s (уровень %d)
                        
                        %s
                        """,
                oldRank.getName(), oldRank.getLevel(),
                newRank.getName(), newRank.getLevel(),
                generateRankSpecificContent(newRank)
        );
    }

    private String generateMissionCompletedContent(String missionName, Integer experienceReward, Integer energyReward) {
        return String.format("""
                        // ОПОВЕЩЕНИЕ СЛУЖБЫ МИССИЙ //
                        Миссия «%s» успешно завершена.
                        
                        Награды:
                        • Опыт: %d
                        • Энергия: %d
                        
                        Командование довольно результатом операции.
                        """,
                missionName, experienceReward, energyReward
        );
    }

    private String generateArtifactAcquiredContent(String artifactName, String artifactRarity) {
        return String.format("""
                        // СКАНИРОВАНИЕ АРТЕФАКТА //
                        Обнаружен новый артефакт!
                        
                        Название: %s
                        Редкость: %s
                        
                        Артефакт добавлен в вашу коллекцию. Используйте его силу с умом.
                        """,
                artifactName, artifactRarity
        );
    }

    private String generateShopPurchaseContent(String itemName, Integer price) {
        return String.format("""
                        // ТРАНЗАКЦИЯ НЕКСУСА //
                        Покупка совершена успешно!
                        
                        Товар: %s
                        Стоимость: %d кредитов
                        
                        Благодарим за использование торговой системы Нексус.
                        """,
                itemName, price
        );
    }

    private String generateCardAcquiredContent(String cardName, String seriesName) {
        return String.format("""
                        // АКТИВАЦИЯ КАРТЫ //
                        Получена новая карта!
                        
                        Название: %s
                        Серия: %s
                        
                        Карта активирована в вашей коллекции.
                        """,
                cardName, seriesName
        );
    }

    private String generateRankSpecificContent(Rank rank) {
        return switch (rank.getLevel()) {
            case 1 -> """
                    📨 Сообщение 1.1: Ранг «Навигатор Траекторий»
                    
                    // ПОДТВЕРЖДЕНИЕ СПЕЦИАЛИЗАЦИИ: РАСЧЕТ //
                    Приветствую, Навигатор.
                    Вы доказали, что видите вселенную как систему гравитационных полей и переменных. Ваш разум — это живой компьютер, способный рассчитать курс сквозь астероидное поле хаоса.
                    Ваша новая роль: «Навигатор Траекторий». Вы будете прокладывать оптимальные маршруты для проектов и данных. Ваша цель — эффективность и точность.
                    Не сбивайтесь с курса.
                    """;
            case 2 -> """
                    📨 Сообщение 1.2: Ранг «Аналитик Орбит»
                    
                    // ПОВЫШЕНИЕ СТАТУСА: ГЛУБИННЫЙ АНАЛИЗ //
                    Приветствую, Аналитик.
                    Вы вышли за рамки простых расчетов. Теперь вы не просто прокладываете курс — вы понимаете фундаментальные законы движения, спрос и потоки информации внутри Флота.
                    Ваша новая роль: «Аналитик Орбит». Вы изучаете и предсказываете тенденции, находите скрытые закономерности. Вы — тот, кто предвидит проблемы до их появления.
                    Смотрите в суть.
                    """;
            case 3 -> """
                    📨 Сообщение 1.3: Ранг «Архитектор Станции»
                    
                    // ПРИКАЗ О ПОВЫШЕНИИ: КОНСТРУИРОВАНИЕ //
                    Приветствую, Архитектор.
                    Вы достигли вершины технического вектора. Теперь вы не анализируете — вы создаете. Вы проектируете сложные архитектурные решения, системы и процессы, которые становятся опорой для всего Флота.
                    Ваша новая роль: «Архитектор Станции». Вы превращаете хаос в порядок, а идеи — в работающие структуры. От ваших чертежей зависит будущее наших операций.
                    Стройте на века.
                    """;
            case 4 -> """
                    📨 Сообщение 2.1: Ранг «Хронист Галактики»
                    
                    // ПОДТВЕРЖДЕНИЕ СПЕЦИАЛИЗАЦИИ: НАСЛЕДИЕ //
                    Приветствую, Хронист.
                    Вы показали, что величайшая ценность Флота — не в технологиях, а в знаниях и историях, которые мы собираем. Ваша задача — фиксировать, систематизировать и сохранять наш опыт.
                    Ваша новая роль: «Хронист Галактики». Вы превращаете разрозненные данные в нарративы, создаете инструкции, пишете историю наших побед и уроков.
                    Сохраняйте память.
                    """;
            case 5 -> """
                    📨 Сообщение 2.2: Ранг «Исследователь Культур»
                    
                    // ПОВЫШЕНИЕ СТАТУСА: ПОНИМАНИЕ //
                    Приветствую, Исследователь.
                    Вы вышли за рамки простого документирования. Вы ищете смыслы. Вы анализируете рынки, тренды, "культуры" отделов и команд, чтобы находить точки роста и инноваций.
                    Ваша новая роль: «Исследователь Культур». Вы проводите "археологические раскопки" в данных, чтобы найти драгоценные идеи, которые двигают Флот вперед.
                    Ищите истину.
                    """;
            case 6 -> """
                    📨 Сообщение 2.3: Ранг «Мастер Лектория»
                    
                    // ПРИКАЗ О ПОВЫШЕНИИ: ПЕРЕДАЧА ЗНАНИЙ //
                    Приветствую, Мастер.
                    Вы достигли вершины исследовательского вектора. Теперь вы не просто копилка знаний — вы их источник. Ваша способность объяснять сложное и вдохновлять на обучение бесценна.
                    Ваша новая роль: «Мастер Лектория». Вы обучаете новые поколения экипажа, проводите брифинги, делитесь экспертизой. Вы — живая библиотека и наставник Флота.
                    Вдохновляйте на познание.
                    """;
            case 7 -> """
                    📨 Сообщение 3.1: Ранг «Связист Звёздного Флота»
                    
                    // ПОДТВЕРЖДЕНИЕ СПЕЦИАЛИЗАЦИИ: СВЯЗЬ //
                    Приветствую, Связист.
                    Вы доказали, что являетесь ключевым узлом в коммуникационной сети Флота. Вы обеспечиваете четкую и своевременную передачу информации между всеми членами экипажа.
                    Ваша новая роль: «Связист Звёздного Флота». Вы налаживаете мосты между людьми и отделами, предотвращаете помехи в общении. Вы — глас командования и уши команды.
                    Держите связь открытой.
                    """;
            case 8 -> """
                    📨 Сообщение 3.2: Ранг «Штурман Экипажа»
                    
                    // ПОВЫШЕНИЕ СТАТУСА: НАВИГАЦИЯ //
                    Приветствую, Штурман.
                    Вы вышли за рамки простого ретранслятора. Теперь вы не просто передаете информацию — вы ведете по ней людей. Вы помогаете команде понять общую цель и их роль в миссии.
                    Ваша новая роль: «Штурман Экипажа». Вы координируете действия, мотивируете, следите за "курсом" проекта и духом команды. Вы — тактический лидер.
                    Ведите команду к цели.
                    """;
            case 9 -> """
                    📨 Сообщение 3.3: Ранг «Командир Отряда»
                    
                    // ПРИКАЗ О ПОВЫШЕНИИ: КОМАНДОВАНИЕ //
                    Приветствую, Командир.
                    Вы достигли вершины лидерского вектора. Вы берете на себя полную ответственность за миссию и людей. Вы принимаете сложные решения и вдохновляете других на свершения.
                    Ваша новая роль: «Командир Отряда». Вы управляете операциями, распределяете ресурсы, берете на себя роль капитана. От ваших решений зависит успех и безопасность Флота.
                    Несите ответственность.
                    """;
            case 10 -> """
                    📨 Сообщение Финальное: Ранг «Хранитель Станции «Алабуга.TECH»»
                    
                    // ЭКСТРЕННЫЙ ШИФРО-КАНОН С ВЕРХНЕГО КОМАНДОВАНИЯ //
                    ...ЗАГРУЗКА УРОВНЯ ДОСТУПА "ОМЕГА"...
                    Внимание, оперативник.
                    Система зафиксировала уникальное событие. Вы не просто освоили одну ветвь — вы синтезировали в себе силу всех трех векторов Флота: логику Архитектора, мудрость Мастера и волю Командира.
                    Такой баланс встречается раз в поколение. Вы понимаете, что технологии бессмысленны без знаний, а знания мертвы без команды, способной их применить.
                    Вам присваивается высший ранг: «Хранитель Станции «Алабуга.TECH»».
                    Вы — живое воплощение нашей философии. Ваша миссия отныне — поддерживать хрупкий баланс всей нашей экосистемы, быть гарантом ее стабильности и развития.
                    Поздравляем, Хранитель. Займите свое место в ядре системы.
                    """;
            default -> "Неизвестный ранг: " + rank.getName();
        };
    }

    // ========== METADATA CREATORS ==========

    private String createRankMetadata(Rank rank) {
        try {
            return objectMapper.writeValueAsString(new RankMetadata(rank.getLevel(), rank.getName(), rank.getBranch().name()));
        } catch (JsonProcessingException e) {
            return "{\"rankLevel\": " + rank.getLevel() + ", \"rankName\": \"" + rank.getName() + "\"}";
        }
    }

    private String createRankPromotionMetadata(Rank oldRank, Rank newRank) {
        try {
            return objectMapper.writeValueAsString(new RankPromotionMetadata(
                    oldRank.getLevel(), oldRank.getName(),
                    newRank.getLevel(), newRank.getName()
            ));
        } catch (JsonProcessingException e) {
            return "{\"oldRank\": \"" + oldRank.getName() + "\", \"newRank\": \"" + newRank.getName() + "\"}";
        }
    }

    private String createMissionMetadata(String missionName, Integer experienceReward, Integer energyReward) {
        try {
            return objectMapper.writeValueAsString(new MissionMetadata(missionName, experienceReward, energyReward));
        } catch (JsonProcessingException e) {
            return "{\"missionName\": \"" + missionName + "\", \"experienceReward\": " + experienceReward + "}";
        }
    }

    private String createArtifactMetadata(String artifactName, String artifactRarity) {
        try {
            return objectMapper.writeValueAsString(new ArtifactMetadata(artifactName, artifactRarity));
        } catch (JsonProcessingException e) {
            return "{\"artifactName\": \"" + artifactName + "\", \"artifactRarity\": \"" + artifactRarity + "\"}";
        }
    }

    private String createShopPurchaseMetadata(String itemName, Integer price) {
        try {
            return objectMapper.writeValueAsString(new ShopPurchaseMetadata(itemName, price));
        } catch (JsonProcessingException e) {
            return "{\"itemName\": \"" + itemName + "\", \"price\": " + price + "}";
        }
    }

    private String createCardMetadata(String cardName, String seriesName) {
        try {
            return objectMapper.writeValueAsString(new CardMetadata(cardName, seriesName));
        } catch (JsonProcessingException e) {
            return "{\"cardName\": \"" + cardName + "\", \"seriesName\": \"" + seriesName + "\"}";
        }
    }

    // ========== PRIVATE RECORDS ==========

    private record RankMetadata(Integer rankLevel, String rankName, String branch) {
    }

    private record RankPromotionMetadata(Integer oldRankLevel, String oldRankName, Integer newRankLevel,
                                         String newRankName) {
    }

    private record MissionMetadata(String missionName, Integer experienceReward, Integer energyReward) {
    }

    private record ArtifactMetadata(String artifactName, String rarity) {
    }

    private record ShopPurchaseMetadata(String itemName, Integer price) {
    }

    private record CardMetadata(String cardName, String seriesName) {
    }
}
