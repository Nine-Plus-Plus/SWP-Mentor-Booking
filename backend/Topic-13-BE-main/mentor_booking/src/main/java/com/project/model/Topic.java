package com.project.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.enums.AvailableStatus;
import jakarta.persistence.*;
import java.io.IOException;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
@Entity
@Table(name = "topic")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_name")
    private String topicName;

    @Column(name = "context", columnDefinition = "LONGTEXT")
    private String context;

    @Column(name = "problems", columnDefinition = "LONGTEXT")
    private String problems;

    @Column(name = "actor")
    private List<String> actor;

    @Lob
    @Column(name = "requirement", columnDefinition = "LONGTEXT")
    private String requirementJson; // Store the list as JSON

    @Transient
    private List<String> requirement; // For easy use in Java code

    @Lob
    @Column(name = "non_function_requirement", columnDefinition = "LONGTEXT")
    private String nonFunctionRequirementJson; // JSON string for database storage

    @Transient
    private List<String> nonFunctionRequirement; // Transient field for list use in Java

    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Projects> project;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private Mentors mentor;

    @ManyToOne
    @JoinColumn(name = "sub_mentor_id")
    private Mentors subMentors;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;

    // Set the requirement list by serializing it to JSON
    public void setRequirement(List<String> requirement) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            this.requirementJson = objectMapper.writeValueAsString(requirement);
            this.requirement = requirement;
        } catch (IOException e) {
            e.printStackTrace(); // Handle or log the exception
        }
    }

    // Get the requirement list by deserializing the JSON string
    public List<String> getRequirement() {
        if (requirementJson != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                this.requirement = objectMapper.readValue(requirementJson, new TypeReference<List<String>>() {
                });
            } catch (IOException e) {
                e.printStackTrace(); // Handle or log the exception
            }
        }
        return this.requirement;
    }

    public void setNonFunctionRequirement(List<String> nonFunctionRequirement) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            this.nonFunctionRequirementJson = objectMapper.writeValueAsString(nonFunctionRequirement);
            this.nonFunctionRequirement = nonFunctionRequirement;
        } catch (IOException e) {
            e.printStackTrace(); // Handle or log the exception
        }
    }

    // Get the non-function requirement list by deserializing the JSON string
    public List<String> getNonFunctionRequirement() {
        if (nonFunctionRequirementJson != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                this.nonFunctionRequirement = objectMapper.readValue(nonFunctionRequirementJson, new TypeReference<List<String>>() {
                });
            } catch (IOException e) {
                e.printStackTrace(); // Handle or log the exception
            }
        }
        return this.nonFunctionRequirement;
    }
}
