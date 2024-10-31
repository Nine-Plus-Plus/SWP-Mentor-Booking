/*

 */
package com.project.controller;

import com.project.dto.GroupDTO;
import com.project.dto.Response;
import com.project.dto.StudentsDTO;
import com.project.model.Group;
import com.project.service.GroupService;
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

/**
 *
 * @author Thịnh Đạt
 */
@RestController
@RequestMapping("/api")
public class GroupController {
    @Autowired
    private GroupService groupService;
    
    @PostMapping("/student/create-group")
    public ResponseEntity<Response> createGroup(@RequestBody GroupDTO createResponse){
        Response response = groupService.createGroup(createResponse);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/user/get-all-groups")
    public ResponseEntity<Response> getAllGroups(){
        Response response = groupService.getAllGroups();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/user/get-group-by-id/{id}")
    public ResponseEntity<Response> getGroupById(@PathVariable Long id){
        Response response = groupService.getGroupById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PutMapping("/student/update-group/{id}")
    public ResponseEntity<Response> updateGroup(@PathVariable Long id, @RequestBody Group newGroup){
        Response response = groupService.updateGroup(id, newGroup);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @DeleteMapping("/student/delete-group/{id}")
    public ResponseEntity<Response> deleteGroup(@PathVariable Long id){
        Response response = groupService.deleteGroup(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PostMapping("/user/add-new-group-member/{id}")
    public ResponseEntity<Response> addNewGroupMember(@PathVariable Long id, @RequestBody StudentsDTO newMember){
        Response response = groupService.addNewGroupMember(id, newMember);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @DeleteMapping("/student/remove-group-member/{id}")
    public ResponseEntity<Response> removeGroupMembre(@PathVariable Long id, @RequestBody StudentsDTO newMember){
        Response response = groupService.removeMember(id, newMember);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/user/get-groups-in-class/{classId}")
    public ResponseEntity<Response> getGroupsByClassId(@PathVariable Long classId){
        Response response = groupService.getGroupsInClass(classId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/get-groups-in-semester/{semesterId}")
    public ResponseEntity<Response> getGroupsBySemesterId(@PathVariable Long semesterId){
        Response response = groupService.getGroupBySemesterId(semesterId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
