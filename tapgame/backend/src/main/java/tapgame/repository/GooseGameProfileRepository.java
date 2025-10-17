package tapgame.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tapgame.entity.GooseGameProfile;

@Repository
public interface GooseGameProfileRepository extends JpaRepository<GooseGameProfile, Long> {
    GooseGameProfile findByUsername(String username);
}
