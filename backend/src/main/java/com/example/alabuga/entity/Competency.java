package com.example.alabuga.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "competencies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Competency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "max_level", nullable = false)
    @Builder.Default
    private Integer maxLevel = 100;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}