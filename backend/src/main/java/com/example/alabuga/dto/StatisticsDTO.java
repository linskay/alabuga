package com.example.alabuga.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDTO {
    private Long activeUsers;
    private Double activeUsersGrowth;
    private Long completedMissions;
    private Double completedMissionsGrowth;
    private Double averageLevel;
    private Double averageLevelGrowth;
    private Double averageTimeInSystem;
    private Double averageTimeInSystemGrowth;
}
