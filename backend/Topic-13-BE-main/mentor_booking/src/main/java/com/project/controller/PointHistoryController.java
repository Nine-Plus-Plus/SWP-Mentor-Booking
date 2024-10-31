package com.project.controller;

import com.project.dto.Response;
import com.project.service.PointHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/point-history")
public class PointHistoryController {
    @Autowired
    private PointHistoryService pointHistoryService;

    @GetMapping("/student/{studentId}")
    public Response getStudentPointHistory(@PathVariable Long studentId) {
        return pointHistoryService.getStudentPointHistory(studentId);
    }

    @GetMapping("/group/{groupId}")
    public Response getGroupPointHistory(@PathVariable Long groupId) {
        return pointHistoryService.getGroupPointHistory(groupId);
    }

    @GetMapping("/groups/points")
    public Response getAllGroupPoints() {
        return pointHistoryService.getAllGroupPoints();
    }
}