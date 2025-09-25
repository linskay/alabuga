package tapgame.service;

import org.springframework.stereotype.Service;
import tapgame.entity.GooseGameProfile;

@Service
public class TapService {
    public void tap(GooseGameProfile profile) {
        profile.setTaps(profile.getTaps() + 1);
    }
}
