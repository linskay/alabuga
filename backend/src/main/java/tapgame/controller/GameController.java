package tapgame.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import tapgame.entity.GooseGameProfile;
import tapgame.repository.GooseGameProfileRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/game")
public class GameController {
    private final GooseGameProfileRepository profileRepository;

    @Autowired
    public GameController(GooseGameProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    // Первый тап: создаём профиль, если его нет, и сохраняем время первого тапа
    @PostMapping("/tap/{userId}")
    public GooseGameProfile tap(@PathVariable Long userId, @RequestParam String username) {
        Optional<GooseGameProfile> optionalProfile = profileRepository.findById(userId);
        GooseGameProfile profile;
        if (optionalProfile.isPresent()) {
            profile = optionalProfile.get();
        } else {
            profile = new GooseGameProfile();
            profile.setUserId(userId);
            profile.setUsername(username);
            profile.setFirstTap(LocalDateTime.now());
        }
        // Здесь можно добавить игровую механику (очки, ачивки и т.д.)
        profileRepository.save(profile);
        return profile;
    }



    @GetMapping("/profile/{userId}")
    public GooseGameProfile getProfile(@PathVariable Long userId) {
        return profileRepository.findById(userId).orElse(null);
    }
}

