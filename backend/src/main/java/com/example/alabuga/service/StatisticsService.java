package com.example.alabuga.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.alabuga.dto.StatisticsDTO;
import com.example.alabuga.entity.User;
import com.example.alabuga.repository.UserMissionRepository;
import com.example.alabuga.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final UserRepository userRepository;
    private final UserMissionRepository userMissionRepository;

    public StatisticsDTO getOverviewStatistics() {
        // Активные пользователи за 30 дней по updatedAt
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        long activeUsers = userRepository.countByUpdatedAtAfter(thirtyDaysAgo);

        // Рост активных пользователей: сравнение с предыдущими 30 днями
        long prevActiveUsers = userRepository.countByUpdatedAtBetween(now.minusDays(60), now.minusDays(30));
        double activeUsersGrowth = prevActiveUsers > 0
                ? ((double) (activeUsers - prevActiveUsers) / prevActiveUsers) * 100.0
                : 0.0;

        // Завершенные миссии
        long completedMissions = userMissionRepository.countByStatus("COMPLETED");
        long prevCompletedMissions = userMissionRepository.countByStatusAndCompletedAtBetween(
                "COMPLETED",
                now.minusDays(60),
                now.minusDays(30)
        );
        double completedMissionsGrowth = prevCompletedMissions > 0
                ? ((double) (completedMissions - prevCompletedMissions) / prevCompletedMissions) * 100.0
                : 0.0;

        // Средний уровень (используем поле rank)
        List<User> allUsers = userRepository.findAll();
        double averageLevel = allUsers.stream()
                .mapToInt(User::getRank)
                .average()
                .orElse(0.0);
        // Рост среднего уровня: простая заглушка 0, т.к. исторических срезов нет
        double averageLevelGrowth = 0.0;

        // Среднее "время в системе" (часы между createdAt и updatedAt)
        double averageTimeInSystem = allUsers.stream()
                .mapToDouble(u -> (u.getCreatedAt() != null && u.getUpdatedAt() != null)
                        ? ChronoUnit.HOURS.between(u.getCreatedAt(), u.getUpdatedAt())
                        : 0.0)
                .average()
                .orElse(0.0);
        // Рост времени в системе: без исторических срезов 0
        double averageTimeInSystemGrowth = 0.0;

        return new StatisticsDTO(
                activeUsers,
                activeUsersGrowth,
                completedMissions,
                completedMissionsGrowth,
                averageLevel,
                averageLevelGrowth,
                averageTimeInSystem,
                averageTimeInSystemGrowth
        );
    }

    public Map<String, Object> getActivityChartData() {
        // Активность по дням за последние 7 дней по updatedAt
        Map<String, Object> chart = new HashMap<>();
        String[] labels = new String[7];
        Integer[] data = new Integer[7];

        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            labels[6 - i] = day.toString();
            LocalDateTime start = day.atStartOfDay();
            LocalDateTime end = day.atTime(23, 59, 59);
            long count = userRepository.countByUpdatedAtBetween(start, end);
            data[6 - i] = (int) count;
        }

        chart.put("labels", labels);
        chart.put("data", data);
        chart.put("type", "line");
        return chart;
    }
}
