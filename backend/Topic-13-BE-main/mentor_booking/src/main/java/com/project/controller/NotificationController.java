package com.project.controller;

import com.project.dto.BookingDTO;
import com.project.dto.NotificationsDTO;
import com.project.dto.Response;
import com.project.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class NotificationController {

    @Autowired
    NotificationService notificationService;

    @PostMapping("/user/create-notification")
    public ResponseEntity<Response> sendNotification(@RequestBody NotificationsDTO notificationsDTO) {
        Response response = notificationService.createNotification(notificationsDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/user/get-noti-by-id/{notiId}")
    public ResponseEntity<Response> getNotificationById(@PathVariable Long notiId){
        Response response = notificationService.getNotificationById(notiId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-all-noti")
    public ResponseEntity<Response> getAllNotifications(){
        Response response = notificationService.getAllNotification();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-noti-by-reciver/{reciverId}")
    public ResponseEntity<Response> getNotificationByReceiverId(@PathVariable Long reciverId){
        Response response = notificationService.getNotificationsByReciverId(reciverId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/user/update-noti/{id}")
    public ResponseEntity<Response> updateNotifications(
            @PathVariable Long id, @RequestBody NotificationsDTO newNotificationsDTO){
        Response response = notificationService.updateNotification(id, newNotificationsDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
