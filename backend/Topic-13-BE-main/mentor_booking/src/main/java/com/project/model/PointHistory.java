package com.project.model;

import com.project.enums.AvailableStatus;
import com.project.enums.PointHistoryStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "point_history")
public class PointHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private int point;
    
    @Enumerated(EnumType.STRING)
    private PointHistoryStatus status;
    
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id") // Foreign key in PointHistory table to Students
    private Students student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id") // Foreign key in PointHistory table to Booking
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}