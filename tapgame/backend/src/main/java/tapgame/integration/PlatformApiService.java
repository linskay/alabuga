package tapgame.integration;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PlatformApiService {
    private final RestTemplate restTemplate = new RestTemplate();

    public void addCredits(Long userId, int credits) {
        String url = "https://platform/api/user/" + userId + "/credits";
        restTemplate.postForObject(url, credits, Void.class);
    }

    public void addAchievement(Long userId, String achievement) {
        String url = "https://platform/api/user/" + userId + "/achievements";
        restTemplate.postForObject(url, achievement, Void.class);
    }
}
