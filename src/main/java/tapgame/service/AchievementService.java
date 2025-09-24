package tapgame.service;

import org.springframework.stereotype.Service;
import tapgame.entity.GooseGameProfile;

@Service
public class AchievementService {
    public void checkAndGrantAchievements(GooseGameProfile profile) {
        int taps = profile.getTaps();
        if (taps >= 1) {
            profile.getAchievements().add("first_click");
        }
        if (taps >= 100) {
            profile.getAchievements().add("hundred_clicks");
        }
        if (taps >= 1000) {
            profile.getAchievements().add("thousand_clicks");
        }
        // Добавь другие ачивки по необходимости
    }
}
