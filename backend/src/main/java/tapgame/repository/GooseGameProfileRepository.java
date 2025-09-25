package tapgame.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tapgame.entity.GooseGameProfile;

public interface GooseGameProfileRepository extends JpaRepository<GooseGameProfile, Long> {
    GooseGameProfile findByUsername(String username);
}
