package com.project.model;

import com.project.enums.AvailableStatus;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "group_table")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_name")
    private String groupName;

    @Column(name = "total_point")
    private int totalPoint;

    @Column(name = "date_created")
    private LocalDate dateCreated;

    @Column(name = "date_updated")
    private LocalDate dateUpdated;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Students> students;  // Một nhóm có thể chứa nhiều sinh viên

    @OneToOne
    @JoinColumn(name = "project_id", unique = true)
    private Projects project;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class aClass;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notifications> notifications;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}
