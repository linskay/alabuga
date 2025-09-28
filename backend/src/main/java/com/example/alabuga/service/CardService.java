package com.example.alabuga.service;

import com.example.alabuga.entity.Card;
import com.example.alabuga.entity.User;
import com.example.alabuga.entity.UserCard;
import com.example.alabuga.repository.CardRepository;
import com.example.alabuga.repository.UserCardRepository;
import com.example.alabuga.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final UserCardRepository userCardRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * Получить все доступные карты для пользователя
     */
    public List<Card> getAvailableCardsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        return cardRepository.findAvailableCardsByRank(user.getRank());
    }

    /**
     * Получить карты пользователя
     */
    public List<UserCard> getUserCards(Long userId) {
        return userCardRepository.findUserCardsOrderedByObtainedDate(userId);
    }

    /**
     * Получить карты пользователя по серии
     */
    public List<UserCard> getUserCardsBySeries(Long userId, String seriesName) {
        return userCardRepository.findUserCardsBySeries(userId, seriesName);
    }

    /**
     * Проверить и выдать карты пользователю при достижении условий
     */
    @Transactional
    public void checkAndAwardCards(Long userId) {
        log.info("Проверка карт для пользователя ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        log.info("Пользователь {} имеет ранг: {}", user.getLogin(), user.getRank());

        List<Card> availableCards = cardRepository.findAvailableCardsByRank(user.getRank());
        log.info("Найдено доступных карт: {}", availableCards.size());

        for (Card card : availableCards) {
            log.info("Проверяем карту: {} (ID: {})", card.getName(), card.getId());
            // Проверяем, есть ли уже эта карта у пользователя
            if (!userCardRepository.existsByUserIdAndCardId(userId, card.getId())) {
                // Выдаем карту пользователю
                UserCard userCard = UserCard.builder()
                        .user(user)
                        .card(card)
                        .isNew(true)
                        .build();

                userCardRepository.save(userCard);
                log.info("Карта '{}' выдана пользователю {}", card.getName(), user.getLogin());

                // Создаем уведомление о получении карты
                notificationService.createCardAcquiredNotification(user, card.getName(), card.getSeriesName());
            } else {
                log.info("Карта '{}' уже есть у пользователя {}", card.getName(), user.getLogin());
            }
        }
    }

    /**
     * Отметить карту как просмотренную
     */
    @Transactional
    public void markCardAsViewed(Long userId, Long cardId) {
        Optional<UserCard> userCardOpt = userCardRepository.findByUserIdAndCardId(userId, cardId);
        if (userCardOpt.isPresent()) {
            UserCard userCard = userCardOpt.get();
            userCard.setIsNew(false);
            userCardRepository.save(userCard);
        }
    }

    /**
     * Получить все серии карт
     */
    public List<String> getAllSeries() {
        return cardRepository.findByIsActiveTrue().stream()
                .map(Card::getSeriesName)
                .distinct()
                .toList();
    }

    /**
     * Получить карты по серии
     */
    public List<Card> getCardsBySeries(String seriesName) {
        return cardRepository.findBySeriesNameAndIsActiveTrue(seriesName);
    }
}
