package com.example.alabuga.dto;

import java.time.LocalDateTime;

import com.example.alabuga.entity.UserCard;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO карты пользователя")
public class UserCardDTO {
    
    @Schema(description = "ID связи", example = "1")
    private Long id;
    
    @Schema(description = "Карта")
    private CardDTO card;
    
    @Schema(description = "Дата получения", example = "2025-09-20T12:34:27.818026")
    private LocalDateTime obtainedAt;
    
    @Schema(description = "Новая ли карта", example = "true")
    private Boolean isNew;
    
    public static UserCardDTO fromEntity(UserCard userCard) {
        return UserCardDTO.builder()
            .id(userCard.getId())
            .card(CardDTO.fromEntity(userCard.getCard()))
            .obtainedAt(userCard.getObtainedAt())
            .isNew(userCard.getIsNew())
            .build();
    }
}
