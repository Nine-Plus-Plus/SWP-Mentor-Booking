package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.enums.AvailableStatus;
import com.project.enums.PointHistoryStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PointHistoryDTO {
    private Long id;
    private int point;
    private PointHistoryStatus status;
    private LocalDateTime dateUpdated;
    private LocalDateTime dateCreated;
    private BookingDTO booking; // Store booking ID instead of full DTO
    private AvailableStatus availableStatus;
    private Long studentId; // Store student ID instead of full DTO
}