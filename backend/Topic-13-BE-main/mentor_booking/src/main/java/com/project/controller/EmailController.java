package com.project.controller;

import com.project.dto.EmailRequest;
import com.project.dto.Response;
import com.project.service.EmailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private EmailServiceImpl emailService;

    @PostMapping("/send")
    public ResponseEntity<Response> sendEmail(@RequestBody EmailRequest emailRequest) {
        Response response = emailService.sendHtmlMail(emailRequest);
        return new ResponseEntity<>(response, HttpStatus.valueOf(response.getStatusCode()));
    }
}
