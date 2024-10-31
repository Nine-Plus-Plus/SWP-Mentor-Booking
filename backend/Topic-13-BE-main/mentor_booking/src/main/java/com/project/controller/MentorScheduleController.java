package com.project.controller;

import com.project.dto.MentorScheduleDTO;
import com.project.dto.Response;
import com.project.service.MentorScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MentorScheduleController {

    @Autowired
    private MentorScheduleService mentorScheduleService;

    @PostMapping("/user/create-mentor-schedule")
    public ResponseEntity<Response> createMentorSchedule(@RequestBody MentorScheduleDTO createRequest) {
        Response response = mentorScheduleService.createMentorSchedule(createRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-all-mentor-schedules")
    public ResponseEntity<Response> getAllMentorSchedules() {
        Response response = mentorScheduleService.getAllMentorSchedule();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-mentor-schedule-by-id/{id}")
    public ResponseEntity<Response> getMentorScheduleById(@PathVariable Long id) {
        Response response = mentorScheduleService.getMentorScheduleById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/user/update-mentor-schedule/{id}")
    public ResponseEntity<Response> updateMentorSchedule(@PathVariable Long id, @RequestBody MentorScheduleDTO updateRequest) {
        Response response = mentorScheduleService.updateMentorSchedule(id, updateRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/user/delete-mentor-schedule/{id}")
    public ResponseEntity<Response> deleteMentorSchedule(@PathVariable Long id) {
        Response response = mentorScheduleService.deleteMentorSchedule(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-mentor-schedules-by-mentor/{mentorId}")
    public ResponseEntity<Response> getMentorSchedulesByMentor(@PathVariable Long mentorId) {
        Response response = mentorScheduleService.getAllMentorScheduleByMentor(mentorId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-mentor-schedules-by-mentor-for-mentor/{mentorId}")
    public ResponseEntity<Response> getMentorSchedulesByMentorForMentor(@PathVariable Long mentorId){
        Response response = mentorScheduleService.getAllMentorScheduleByMentorForMentor(mentorId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/user/expire-mentor-schedule/{id}")
    public ResponseEntity<Response> expireMentorSchedule(@PathVariable Long id){
        Response response = mentorScheduleService.expireMentorSchedule(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
