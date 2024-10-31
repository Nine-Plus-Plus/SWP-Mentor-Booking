package com.project.model;

import com.project.enums.AvailableStatus;
import jakarta.persistence.*;

import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "skills")
public class Skills {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "skill_name")
    private String skillName;
    
    @Column(name = "skill_description")
    private String skillDescription;
    
    @ManyToMany(mappedBy = "skills")
    private List<Mentors> mentors;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}
