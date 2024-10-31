package com.project.model;

import com.project.enums.AvailableStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "reviews")
public class Reviews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "comment")
    private String comment;
    
    @Column(name = "rating")
    private int rating;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) 
    private Users user;

    @ManyToOne
    @JoinColumn(name = "user_receive_id", nullable = false)
    private Users userReceive;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;
}
