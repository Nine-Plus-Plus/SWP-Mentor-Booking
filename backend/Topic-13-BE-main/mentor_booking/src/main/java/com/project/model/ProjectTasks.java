package com.project.model;

import com.project.enums.AvailableStatus;
import com.project.enums.ProjectTaskStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "project_tasks")
public class ProjectTasks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "task_name")
    private String taskName;
    
    @Column(name = "description")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProjectTaskStatus status;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Projects projects;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}