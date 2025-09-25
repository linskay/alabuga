package tapgame.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class GooseGameProfile {
    @Id
    private Long userId;

    private int taps;
    private int coins;
    private int level;
    private int evolutionStage;
    private boolean boostAvailable;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> achievements = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> ownedSkins = new HashSet<>();

    private String activeSkin;

    // Геттеры и сеттеры
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public int getTaps() { return taps; }
    public void setTaps(int taps) { this.taps = taps; }
    public int getCoins() { return coins; }
    public void setCoins(int coins) { this.coins = coins; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public int getEvolutionStage() { return evolutionStage; }
    public void setEvolutionStage(int evolutionStage) { this.evolutionStage = evolutionStage; }
    public boolean isBoostAvailable() { return boostAvailable; }
    public void setBoostAvailable(boolean boostAvailable) { this.boostAvailable = boostAvailable; }
    public Set<String> getAchievements() { return achievements; }
    public void setAchievements(Set<String> achievements) { this.achievements = achievements; }
    public Set<String> getOwnedSkins() { return ownedSkins; }
    public void setOwnedSkins(Set<String> ownedSkins) { this.ownedSkins = ownedSkins; }
    public String getActiveSkin() { return activeSkin; }
    public void setActiveSkin(String activeSkin) { this.activeSkin = activeSkin; }
}