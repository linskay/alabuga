package tapgame.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class GooseGameProfile {
    @Id
    private Long userId;

    private String username;

    private LocalDateTime firstTap;

    // Геттеры и сеттеры
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public LocalDateTime getFirstTap() { return firstTap; }
    public void setFirstTap(LocalDateTime firstTap) { this.firstTap = firstTap; }
}

