package tapgame.entity;

import java.util.HashSet;
import java.util.Set;

public class GooseGameProfile {
    private Long userId;
    private int taps;
    private int coins;
    private Set<String> achievements = new HashSet<>();
    private String evolutionStage;

    public GooseGameProfile(Long userId) {
        this.userId = userId;
        this.taps = 0;
        this.coins = 0;
        this.evolutionStage = "Курсант";
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public int getTaps() { return taps; }
    public void setTaps(int taps) { this.taps = taps; }
    public int getCoins() { return coins; }
    public void setCoins(int coins) { this.coins = coins; }
    public Set<String> getAchievements() { return achievements; }
    public void setAchievements(Set<String> achievements) { this.achievements = achievements; }
    public String getEvolutionStage() { return evolutionStage; }
    public void setEvolutionStage(String evolutionStage) { this.evolutionStage = evolutionStage; }
}
