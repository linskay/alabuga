package tapgame.controller;

import org.springframework.web.bind.annotation.*;
import tapgame.entity.GooseGameProfile;
import tapgame.service.TapService;
import tapgame.service.AchievementService;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/game")
public class GameController {
    private final TapService tapService;
    private final AchievementService achievementService;
    // Для примера: in-memory хранилище профилей
    private final Map<Long, GooseGameProfile> profiles = new ConcurrentHashMap<>();

    public GameController(TapService tapService, AchievementService achievementService) {
        this.tapService = tapService;
        this.achievementService = achievementService;
    }

    @PostMapping("/tap/{userId}")
    public GooseGameProfile tap(@PathVariable Long userId) {
        GooseGameProfile profile = profiles.computeIfAbsent(userId, GooseGameProfile::new);
        tapService.tap(profile);
        achievementService.checkAndGrantAchievements(profile);
        return profile;
    }

    @GetMapping("/profile/{userId}")
    public GooseGameProfile getProfile(@PathVariable Long userId) {
        return profiles.computeIfAbsent(userId, GooseGameProfile::new);
    }
}
