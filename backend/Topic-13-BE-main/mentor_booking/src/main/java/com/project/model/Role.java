package com.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.enums.AvailableStatus;
import jakarta.persistence.*;

import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "role_name")
    private String roleName;
    
    @Column(name = "role_description")
    private String roleDescription;
    
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Users> listUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}
