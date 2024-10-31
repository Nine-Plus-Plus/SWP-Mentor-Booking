package com.project.controller;

import com.project.dto.Response;
import com.project.dto.ReviewsDTO;
import com.project.service.ReviewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReviewsController {

    @Autowired
    private ReviewsService reviewsService;

    @PostMapping("/user/create-review")
    public ResponseEntity<Response> createReview(@RequestBody ReviewsDTO createRequest) {
        Response response = reviewsService.createReview(createRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-all-reviews")
    public ResponseEntity<Response> getAllReviews() {
        Response response = reviewsService.getAllReviews();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/reviews/{id}")
    public ResponseEntity<Response> getReviewById(@PathVariable Long id) {
        Response response = reviewsService.getReviewById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/user/update-review/{id}")
    public ResponseEntity<Response> updateReview(@PathVariable Long id, @RequestBody ReviewsDTO updateRequest) {
        Response response = reviewsService.updateReview(id, updateRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/user/delete-review/{id}")
    public ResponseEntity<Response> deleteReview(@PathVariable Long id) {
        Response response = reviewsService.deleteReview(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/reviews/user/{userId}")
    public ResponseEntity<Response> getReviewsByUserId(@PathVariable Long userId) {
        Response response = reviewsService.getReviewsByUserId(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("/user/reviews/receive-user/{userReceiveId}")
    public ResponseEntity<Response> getReviewsByUserReceiveId(@PathVariable Long userReceiveId) {
        Response response = reviewsService.getReviewsByUserReceiveId(userReceiveId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}