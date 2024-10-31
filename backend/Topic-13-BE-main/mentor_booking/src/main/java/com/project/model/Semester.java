package com.project.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.enums.AvailableStatus;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "semester")
public class Semester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "semester_name")
    private String semesterName;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @OneToMany(mappedBy = "semester", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Class> classes;

    @OneToMany(mappedBy = "semester", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Topic> topics;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;

    @Column(name = "dateStart")
    private LocalDate dateStart;

    @Column(name = "dateEnd")
    private LocalDate dateEnd;
}
