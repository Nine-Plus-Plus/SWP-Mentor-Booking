package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.enums.AvailableStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectsDTO {
    private Long id;
    private String projectName;
    private float percentage;
    private String description;
    private LocalDateTime dateCreated;
    private LocalDateTime dateUpdated;
    private List<ProjectTasksDTO> projectTasks;
    private TopicDTO topic;
    private GroupDTO group;
    private AvailableStatus availableStatus;
}
