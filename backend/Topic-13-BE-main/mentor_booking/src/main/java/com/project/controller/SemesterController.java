package com.project.controller;

import com.project.dto.Response;
import com.project.dto.SemesterDTO;
import com.project.model.Semester;
import com.project.service.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SemesterController {

    @Autowired
    private SemesterService semesterService;

    @PostMapping("/admin/create-semester")
    public ResponseEntity<Response> createSemester(@RequestBody SemesterDTO createResponse){
        Response response = semesterService.createSemester(createResponse);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/get-all-semesters")
    public ResponseEntity<Response> getAllSemesters(){
        Response response = semesterService.getAllSemesters();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/get-semester-by-id/{id}")
    public ResponseEntity<Response> getSemesterById(@PathVariable Long id){
        Response response = semesterService.getSemesterById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/admin/update-semester/{id}")
    public ResponseEntity<Response> updateSemester(@PathVariable Long id, @RequestBody SemesterDTO newSemester){
        Response response = semesterService.updateSemester(id, newSemester);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete-semester/{id}")
    public ResponseEntity<Response> deleteSemester(@PathVariable Long id){
        Response response = semesterService.deleteSemester(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
}
