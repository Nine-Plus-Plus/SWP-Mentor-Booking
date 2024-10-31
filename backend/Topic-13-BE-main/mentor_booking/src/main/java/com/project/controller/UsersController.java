
package com.project.controller;

import com.project.dto.CreateMentorRequest;
import com.project.dto.CreateStudentRequest;
import com.project.dto.Response;
import com.project.dto.UsersDTO;
import com.project.model.Users;
import com.project.service.AuthService;
import com.project.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class UsersController {
    @Autowired
    private UsersService userService;

    @Autowired
    private AuthService authService;
    
    @PostMapping("/auth/create-user")
    public ResponseEntity<Response> createUser(@RequestBody UsersDTO createRes){
        Response response = userService.createUser(createRes);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/admin/create-student")
    public ResponseEntity<Response> createStudentRequestResponseEntity(
            @RequestPart("student") CreateStudentRequest createStudentRequest,
            @RequestPart(value = "avatarFile", required = false) MultipartFile avatarFile) {

        if (avatarFile != null && !avatarFile.isEmpty()) {
            createStudentRequest.setAvatarFile(avatarFile);
        }
        Response response = userService.createStudents(createStudentRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/admin/create-mentor")
    public ResponseEntity<Response> createMentorRequestResponseEntity(
            @RequestPart("mentor") CreateMentorRequest createMentorRequest,
            @RequestPart(value = "avatarFile", required = false) MultipartFile avatarFile
    ){
        if (avatarFile != null && !avatarFile.isEmpty()) {
            createMentorRequest.setAvatarFile(avatarFile);
        }
        Response response = userService.createMentors(createMentorRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/admin/get-all-users")
    public ResponseEntity<Response> getAllUsers(){
        Response response = userService.getAllUser();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/admin/get-user-by-id/{id}")
    public ResponseEntity<Response> getUserById(@PathVariable Long id){
        Response response = userService.getUserById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @DeleteMapping("/admin/delete-user/{id}")
    public ResponseEntity<Response> deleteUser(@PathVariable Long id) {
        Response response = userService.deleteUser(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/user/get-my-profile")
    public ResponseEntity<Response> getMyProfile() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Response response = userService.getMyProfile(username);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/view-user-detail-by-id/{id}")
    public ResponseEntity<Response> getUserDetail(@PathVariable Long id){
        Response response = userService.viewDetailUser(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/user/change-password-user")
    public ResponseEntity<Response> changePasswordInUser(@RequestBody Response changeRequest){
        Response response = authService.changePasswordInUser(changeRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}