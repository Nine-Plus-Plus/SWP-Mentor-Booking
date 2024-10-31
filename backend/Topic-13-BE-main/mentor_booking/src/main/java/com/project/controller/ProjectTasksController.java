package com.project.controller;

import com.project.dto.ProjectTasksDTO;
import com.project.dto.Response;
import com.project.service.ProjectTasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProjectTasksController {

    @Autowired
    private ProjectTasksService projectTasksService;

    @PostMapping("/student/create-task")
    public ResponseEntity<Response> createTask(@RequestBody ProjectTasksDTO taskDTO) {
        Response response = projectTasksService.createTask(taskDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-all-tasks")
    public ResponseEntity<Response> getAllTasks() {
        Response response = projectTasksService.getAllTasks();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-task-by-id/{id}")
    public ResponseEntity<Response> getTaskById(@PathVariable Long id) {
        Response response = projectTasksService.getTaskById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/student/update-task/{id}")
    public ResponseEntity<Response> updateTask(@PathVariable Long id, @RequestBody ProjectTasksDTO taskDTO) {
        Response response = projectTasksService.updateTask(id, taskDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/student/delete-task/{id}")
    public ResponseEntity<Response> deleteTask(@PathVariable Long id) {
        Response response = projectTasksService.deleteTask(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("/student/project-tasks/group/{groupId}")
    public ResponseEntity<Response> getProjectTasksByGroupId(@PathVariable Long groupId) {
        Response response = projectTasksService.getProjectTasksByGroupId(groupId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
}