package com.project.controller;

import com.project.dto.BookingDTO;
import com.project.dto.Response;
import com.project.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Thịnh Đạt
 */
@RestController
@RequestMapping("/api")
public class MeetingController {
    
    @Autowired
    private MeetingService meetingService;
    
    @PostMapping("/user/create-meeting")
    public ResponseEntity<Response> createMeeting(@RequestBody BookingDTO bookingDTO){
        Long bookingId = bookingDTO.getId();
        Response response = meetingService.createMeeting(bookingId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/user/get-meeting-by-booking-id/{bookingId}")
    public ResponseEntity<Response> getMeetingByBookingId(@PathVariable Long bookingId){
        Response response = meetingService.getMeetingByBookingId(bookingId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/user/get-meetings-by-user-id/{userId}")
    public ResponseEntity<Response> getMeetingsByUserId(@PathVariable Long userId){
        Response response = meetingService.getMeetingsByUserId(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
}
