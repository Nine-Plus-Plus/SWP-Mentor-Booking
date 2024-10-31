package com.project.controller;

import com.project.dto.BookingDTO;
import com.project.dto.Response;
import com.project.enums.BookingStatus;
import com.project.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Thịnh Đạt
 */
@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/student/create-booking")
    public ResponseEntity<Response> createBooking(@RequestBody BookingDTO createResponse) {
        Response response = bookingService.createBooking(createResponse);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-all-active-bookings")
    public ResponseEntity<Response> getAllActiveBookings() {
        Response response = bookingService.getAllActiveBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-all-old-bookings")
    public ResponseEntity<Response> getAllOldBookings() {
        Response response = bookingService.getAllOldBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-bookings-in-class/{classId}")
    public ResponseEntity<Response> getBookingsInClass(@PathVariable Long classId) {
        Response response = bookingService.getBookingsInClass(classId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/mentor/accept-booking/{bookingId}")
    public ResponseEntity<Response> acceptBooking(@PathVariable Long bookingId) {
        Response response = bookingService.acceptBooking(bookingId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/mentor/reject-booking/{bookingId}")
    public ResponseEntity<Response> rejectBooking(@PathVariable Long bookingId) {
        Response response = bookingService.rejectBooking(bookingId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/mentor/cancel-booking/{bookingId}")
    public ResponseEntity<Response> cancelBookingByMentor(@PathVariable Long bookingId) {
        Response response = bookingService.cancelBooking(bookingId, "MENTOR");
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PostMapping("/student/cancel-booking/{bookingId}")
    public ResponseEntity<Response> cancelBookingByStudent(@PathVariable Long bookingId) {
        Response response = bookingService.cancelBooking(bookingId, "STUDENTS");
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/user/get-bookings-by-mentor-id/")
    public ResponseEntity<Response> getBookingsByMentorId(
            @RequestParam(required = false) Long mentorId,
            @RequestParam(required = false) BookingStatus status) {
        Response response = bookingService.getBookingsByMentorId(mentorId, status);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/user/get-bookings-by-group-id/")
    public ResponseEntity<Response> getBookingsByGroupId(
            @RequestParam(required = false) Long groupId,
            @RequestParam(required = false) BookingStatus status) {
        Response response = bookingService.getBookingsByGroupId(groupId, status);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/get-booking-by-semesterId/{semesterId}")
    public ResponseEntity<Response> getBookingsBySemesterId(@PathVariable Long semesterId) {
        Response response = bookingService.getBookingBySemesterId(semesterId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/admin/get-all-by-status/")
    public ResponseEntity<Response> getAllByBookingStatus(@RequestParam(required = false) BookingStatus status) {
        Response response = bookingService.getAllByBookingStatus(status);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
