package com.project.model;

import com.project.enums.AvailableStatus;
import com.project.enums.BookingStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status;
    
    @Column(name = "pointPay")
    private int pointPay;
    
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @Column(name = "expiredTime")
    private LocalDateTime expiredTime;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id") // Foreign key in Booking table to Group
    private Group group;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id") // Foreign key in Booking table to Mentor
    private Mentors mentor;
    
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Meeting meeting;
    
    // Quan hệ ManyToOne với MentorSchedule
    @ManyToOne
    @JoinColumn(name = "mentor_schedule_id")
    private MentorSchedule mentorSchedule;
    
    @OneToMany(mappedBy = "booking")
    private List<PointHistory> pointHistories;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notifications> notifications;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}
