
package com.project.controller;

import com.project.dto.ClassDTO;
import com.project.dto.Response;
import com.project.model.Class;
import com.project.service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author Thịnh Đạt
 */
@RestController
@RequestMapping("/api")
public class ClassController {
    
    @Autowired
    private ClassService classService;
    
    @PostMapping("/admin/create-class")
    public ResponseEntity<Response> createClass(@RequestBody ClassDTO createResponse){
        Response response = classService.createClass(createResponse);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/admin/get-all-class")
    public ResponseEntity<Response> getAllClass(){
        Response response = classService.getAllClasses();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/admin/get-class-by-id/{id}")
    public ResponseEntity<Response> getClassById(@PathVariable Long id){
        Response response = classService.getClassById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-class-by-mentor/{mentorId}")
    public ResponseEntity<Response> getClassByMentor(@PathVariable Long mentorId) {
        Response response = classService.getClassByMentorId(mentorId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/get-classes-by-semester/{semesterId}")
    public ResponseEntity<Response> getClassesBySemester(
            @PathVariable Long semesterId,
            @RequestParam(required = false) String name
    ) {
        Response response = classService.getClassesSemesterId(semesterId, name);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PutMapping("/admin/update-class/{id}")
    public ResponseEntity<Response> updateClass(@PathVariable Long id, @RequestBody Class newClass){
        Response response = classService.updateClass(id, newClass);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @DeleteMapping("/admin/delete-class/{id}")
    public ResponseEntity<Response> deleteClass(@PathVariable Long id){
        Response response = classService.deleteClass(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/unassigned-mentors")
    public ResponseEntity<Response> getUnassignedMentors() {
        Response response = classService.getUnassignedMentors();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
