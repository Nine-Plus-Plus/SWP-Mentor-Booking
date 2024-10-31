package com.project.controller;

import com.project.dto.Response;
import com.project.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody Response loginRequest) {
        Response response = authService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<Response> changePassword(@RequestBody Response changeRequest){
        Response response = authService.changePassword(changeRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/email-existed")
    public ResponseEntity<Response> isEmailExisted(@RequestBody Response responseEmail) {
        Response response = authService.findByGmailChangePassword(responseEmail);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/otp-existed")
    public ResponseEntity<Response> isCorrectOTP(@RequestBody Response responseEmail) {
        Response response = authService.findByOTPChangePassword(responseEmail);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
