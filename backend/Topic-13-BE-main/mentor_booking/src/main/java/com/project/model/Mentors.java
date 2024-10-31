package com.project.model;

import com.project.enums.AvailableStatus;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "mentors")
public class Mentors {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "star")
    private float star;
    @Column(name = "mentor_code")
    private String mentorCode;
    @Column(name = "total_time_remain")
    private float totalTimeRemain;
    @Column(name = "date_created")
    private LocalDate dateCreated;
    @Column(name = "date_updated")
    private LocalDate dateUpdated;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private Users user;

    @ManyToMany
    @JoinTable(
            name = "mentor_skills", // Bảng trung gian
            joinColumns = @JoinColumn(name = "mentor_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private List<Skills> skills;

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;
    
    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MentorSchedule> mentorSchedules;

    @OneToOne(mappedBy = "mentor")
    private Class assignedClass;

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Topic> topics;

    @OneToMany(mappedBy = "subMentors", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Topic> topicsWithSubMentors;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}
