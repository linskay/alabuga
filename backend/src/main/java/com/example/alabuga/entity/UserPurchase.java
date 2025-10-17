package com.example.alabuga.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_purchases")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties("user")
@Schema(description = "Сущность покупки пользователя")
public class UserPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Уникальный идентификатор покупки", example = "1")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"competencies", "artifacts", "purchases"})
    @Schema(description = "Пользователь")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_item_id", nullable = false)
    @JsonIgnoreProperties({"userPurchases"})
    @Schema(description = "Товар из магазина")
    private ShopItem shopItem;

    @Column(name = "purchased_at", nullable = false)
    @Schema(description = "Дата покупки", example = "2025-01-20T12:34:27")
    private LocalDateTime purchasedAt;

    @Column(name = "price_paid", nullable = false)
    @Schema(description = "Цена, которую заплатил пользователь", example = "500")
    private Integer pricePaid;

    @Column(name = "energy_after", nullable = false)
    @Schema(description = "Остаток энергонов после покупки", example = "300")
    private Integer energyAfter;
}
