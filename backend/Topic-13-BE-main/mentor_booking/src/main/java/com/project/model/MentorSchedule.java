
package com.project.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.enums.AvailableStatus;
import com.project.enums.MentorScheduleStatus;
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
@Table(name = "mentor_schedule")
public class MentorSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "available_from")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime availableFrom;
    
    @Column(name = "available_to")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime availableTo;
    
    @Enumerated(EnumType.STRING)
    private MentorScheduleStatus status;
    
    // Quan hệ ManyToOne với Mentors
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id")
    private Mentors mentor;

    // Quan hệ OneToMany với Booking
    @OneToMany(mappedBy = "mentorSchedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> booking;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}
