package com.project.model;

import com.project.enums.AvailableStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "projects")
public class Projects {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "project_name")
    private String projectName;
    
    @Column(name = "percentage")
    private float percentage;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;
    
    @OneToMany(mappedBy = "projects", cascade = CascadeType.ALL, fetch = FetchType.LAZY)  // Thiết lập mối quan hệ OneToMany
    private List<ProjectTasks> projectTasks;
    
    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;
    
    @OneToOne
    @JoinColumn(name = "group_id", unique = true)
    private Group group;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}