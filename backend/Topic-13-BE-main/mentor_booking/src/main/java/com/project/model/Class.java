package com.project.model;


import com.project.enums.AvailableStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "class")
public class Class {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "class_name")
    private String className;
    
    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @OneToMany(mappedBy = "aClass")
    private List<Students> students; 
    
    @OneToMany(mappedBy = "aClass", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Group> groups;

    @OneToOne
    @JoinColumn(name = "mentor_id")
    private Mentors mentor;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}
