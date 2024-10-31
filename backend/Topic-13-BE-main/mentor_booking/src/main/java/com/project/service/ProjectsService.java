package com.project.service;

import com.project.dto.ProjectsDTO;
import com.project.dto.Response;
import com.project.enums.AvailableStatus;
import com.project.exception.OurException;
import com.project.model.Projects;
import com.project.model.Topic;
import com.project.model.Group;
import com.project.repository.ProjectsRepository;
import com.project.repository.TopicRepository;
import com.project.repository.GroupRepository;
import com.project.ultis.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectsService {

    @Autowired
    private ProjectsRepository projectsRepository;
    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private GroupRepository groupRepository;

    public Response createProject(ProjectsDTO createRequest) {
        Response response = new Response();
        try {
            // Validate createRequest
            if (createRequest == null) {
                throw new OurException("Create request cannot be null");
            }
            if (createRequest.getProjectName() == null || createRequest.getProjectName().isEmpty()) {
                throw new OurException("Project name cannot be null or empty");
            }
            // Convert ProjectsDTO Object to Projects Entity Object
            Projects project = new Projects();
            project.setPercentage(0); // Set percentage to 0 when creating a new project
            project.setDateCreated(LocalDateTime.now()); // Set dateCreated to current time
            project.setDateUpdated(LocalDateTime.now()); // Set dateUpdated to current time
            project.setAvailableStatus(AvailableStatus.ACTIVE); // Set status to ACTIVE when creating a new project
            project.setDescription(createRequest.getDescription());
            project.setProjectName(createRequest.getProjectName());

            Group group = groupRepository.findByIdAndAvailableStatus(createRequest.getGroup().getId(), AvailableStatus.ACTIVE);
            if (group == null) {
                throw new OurException("Cannot find group with id: " + createRequest.getGroup().getId());
            }
            group.setProject(project);
            project.setGroup(group);
            if (createRequest.getTopic() != null) {
                Topic topic = topicRepository.findByIdAndAvailableStatus(createRequest.getTopic().getId(), AvailableStatus.ACTIVE);
                if (topic == null) {
                    throw new OurException("Cannot find topic with id: " + createRequest.getTopic().getId());
                }
                project.setTopic(topic);
            }

            // Save the project
            projectsRepository.save(project);
            // Convert Projects Entity Object to ProjectsDTO Object
            if (project.getId() > 0) {
                ProjectsDTO dto = Converter.convertProjectToProjectDTO(project);
                response.setProjectsDTO(dto); // Set single ProjectsDTO object
                response.setStatusCode(200);
                response.setMessage("Project created successfully");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during project creation: " + e.getMessage());
        }
        return response;
    }

    public Response getAllProjects() {
        Response response = new Response();
        try {
            List<Projects> projectsList = projectsRepository.findByAvailableStatus(AvailableStatus.ACTIVE);
            List<ProjectsDTO> projectsDTOList = new ArrayList<>();
            if (projectsList != null) {
                projectsDTOList = projectsList.stream()
                        .map(Converter::convertProjectToProjectDTO)
                        .collect(Collectors.toList());
                response.setProjectsDTOList(projectsDTOList);
                response.setStatusCode(200);
                response.setMessage("Projects fetched successfully");
            } else {
                response.setProjectsDTOList(projectsDTOList);
                throw new OurException("Cannot find any project");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during retrieving projects: " + e.getMessage());
        }
        return response;
    }

    public Response getProjectById(Long id) {
        Response response = new Response();
        try {
            Projects project = projectsRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            // dat sai thu tu logic, nen check null truoc de throw
            if (project == null) {
                throw new OurException("No data found");
            }
            ProjectsDTO dto = Converter.convertProjectToProjectDTO(project);
            response.setProjectsDTO(dto);
            if (project != null) {
                response.setStatusCode(200);
                response.setMessage("Successfully");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during retrieving project: " + e.getMessage());
        }
        return response;
    }

    public Response updateProject(Long id, ProjectsDTO updateRequest) {
        Response response = new Response();
        try {
            Projects project = projectsRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            if (updateRequest.getProjectName() != null) {
                project.setProjectName(updateRequest.getProjectName());
            }
            if (updateRequest.getDescription() != null) {
                project.setDescription(updateRequest.getDescription());
            }
            if (updateRequest.getPercentage() != 0) {
                project.setPercentage(updateRequest.getPercentage());
            }
            if (updateRequest.getTopic() != null) {
                Topic topic = topicRepository.findByIdAndAvailableStatus(updateRequest.getTopic().getId(), AvailableStatus.ACTIVE);
                if (topic == null) {
                    throw new OurException("Cannot find topic with id: " + updateRequest.getTopic().getId());
                }
                project.setTopic(topic);
            }
            project.setDateUpdated(LocalDateTime.now()); // Set dateUpdated to current time
            projectsRepository.save(project);
            ProjectsDTO dto = Converter.convertProjectToProjectDTO(project);
            response.setProjectsDTO(dto); // Set single ProjectsDTO object
            response.setStatusCode(200);
            response.setMessage("Project updated successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during project update: " + e.getMessage());
        }
        return response;
    }

    public Response deleteProject(Long id) {
        Response response = new Response();
        try {
            Projects project = projectsRepository.findById(id)
                    .orElseThrow(() -> new OurException("Project not found"));
            project.setAvailableStatus(AvailableStatus.DELETED); // Set status to DELETED
            projectsRepository.save(project);
            response.setStatusCode(200);
            response.setMessage("Project marked as deleted successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during project deletion: " + e.getMessage());
        }
        return response;
    }
}