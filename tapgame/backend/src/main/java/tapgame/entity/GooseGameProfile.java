package tapgame.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "goose_game_profile")
public class GooseGameProfile {
    @Id
    @Column(name = "id_tg", nullable = false)
    private Long userId;

    @Column(name = "username_tg")
    private String username;

    @Column(name = "start")
    private LocalDateTime firstTap;

    // Геттеры и сеттеры
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public LocalDateTime getFirstTap() { return firstTap; }
    public void setFirstTap(LocalDateTime firstTap) { this.firstTap = firstTap; }
}

