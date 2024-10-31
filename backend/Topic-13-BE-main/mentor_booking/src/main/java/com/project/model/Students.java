package com.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.enums.AvailableStatus;
import com.project.enums.GroupRole;
import jakarta.persistence.*;

import java.time.LocalDate;

//import org.hibernate.mapping.List;

import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "students")
public class Students {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "expertise")
    private String expertise;
    
    @Column(name = "student_code")
    private String studentCode;
    
    @Column(name = "point")
    private int point;
    
    @Column(name = "date_updated")
    private LocalDate dateUpdated;
    
    @Column(name = "date_created")
    private LocalDate dateCreated;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true) // Khóa ngoại liên kết với bảng Users
    private Users user;
    
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = true)  // Khóa ngoại liên kết với Group
    private Group group;  // Mỗi sinh viên chỉ thuộc 1 nhóm
    
    @ManyToOne
    @JoinColumn(name = "class_id", nullable = true)
    @JsonIgnore
    private Class aClass;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "group_role")
    private GroupRole groupRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;

    @OneToMany(mappedBy = "student")
    private List<PointHistory> pointHistories;

}
