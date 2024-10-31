package com.project.service;

import com.project.dto.MeetingDTO;
import com.project.dto.ReviewsDTO;
import com.project.dto.UsersDTO;
import com.project.dto.Response;
import com.project.enums.AvailableStatus;
import com.project.exception.OurException;

import com.project.model.Meeting;
import com.project.model.Mentors;
import com.project.model.Reviews;
import com.project.model.Users;
import com.project.repository.MeetingRepository;
import com.project.repository.MentorsRepository;
import com.project.repository.ReviewsRepository;
import com.project.repository.UsersRepository;
import com.project.ultis.Converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewsService {

    @Autowired
    private ReviewsRepository reviewsRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private MentorsRepository mentorsRepository;

    @Autowired
    private MeetingRepository meetingRepository;

    public Response createReview(ReviewsDTO createRequest) {
        Response response = new Response();
        try {
            // Fetch the full UsersDTO objects based on the provided IDs
            Users user = usersRepository.findById(createRequest.getUser().getId())
                    .orElseThrow(() -> new OurException("User not found"));
            Users userReceive = usersRepository.findById(createRequest.getUserReceive().getId())
                    .orElseThrow(() -> new OurException("User Receive not found"));

            if (createRequest.getMeeting() == null) {
                throw new OurException("Cannot get meeting");
            }
            Meeting meeting = meetingRepository.findByIdAndAvailableStatus(createRequest.getMeeting().getId(), AvailableStatus.ACTIVE);
            if (meeting == null) {
                throw new OurException("Cannot find meeting by id: " + createRequest.getMeeting().getId());
            }
            Reviews review = mapToEntity(createRequest);
            review.setUser(user);
            review.setUserReceive(userReceive);
            review.setDateCreated(LocalDateTime.now());
            review.setMeeting(meeting);
            reviewsRepository.save(review);

            updateMentorStar(userReceive.getId());

            ReviewsDTO dto = convertReviewToReviewDTO(review);
            response.setReviewsDTO(dto);
            response.setStatusCode(200);
            response.setMessage("Review created successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during review creation: " + e.getMessage());
        }
        return response;
    }

    private void updateMentorStar(Long mentorId) {
        List<Reviews> reviews = reviewsRepository.findByUserReceiveId(mentorId, Sort.by(Sort.Direction.DESC, "dateCreated"));
        double sumRatings = reviews.stream()
                .mapToInt(Reviews::getRating)
                .sum();
        Mentors mentor = mentorsRepository.findByUser_Id(mentorId);
        if (mentor != null) {
            double currentAverageRating = mentor.getStar();
            double totalRatings = sumRatings + currentAverageRating;
            double averageRating = totalRatings / (reviews.size() + 1);  //Rule of average for this project
            //Update mentor star, but with Student is null
            mentor.setStar((float) averageRating);
            mentorsRepository.save(mentor);
        }

    }

    private Reviews mapToEntity(ReviewsDTO dto) {
        Reviews review = new Reviews();
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());
        review.setAvailableStatus(dto.getAvailableStatus() != null ? dto.getAvailableStatus() : AvailableStatus.ACTIVE);
        review.setDateCreated(dto.getDateCreated());
        return review;
    }

    private ReviewsDTO convertReviewToReviewDTO(Reviews review) {
        ReviewsDTO reviewsDTO = new ReviewsDTO();
        reviewsDTO.setId(review.getId());
        reviewsDTO.setComment(review.getComment());
        reviewsDTO.setRating(review.getRating());
        reviewsDTO.setDateCreated(review.getDateCreated());
        reviewsDTO.setAvailableStatus(review.getAvailableStatus());
       
        if (review.getUser() != null) {
            UsersDTO userDTO = Converter.convertUserToUserDTO(review.getUser());
            reviewsDTO.setUser(userDTO);
        }

        if (review.getUserReceive() != null) {
            UsersDTO userReceiveDTO = Converter.convertUserToUserDTO(review.getUserReceive());
            reviewsDTO.setUserReceive(userReceiveDTO);
        }
        
        if (review.getMeeting() != null){
            MeetingDTO meetingDTO = new MeetingDTO();
            meetingDTO.setId(review.getMeeting().getId());
        }

        return reviewsDTO;
    }

    private ReviewsDTO mapToDTO(Reviews review) {
        ReviewsDTO dto = new ReviewsDTO();
        dto.setId(review.getId());
        dto.setComment(review.getComment());
        dto.setRating(review.getRating());
        dto.setDateCreated(review.getDateCreated());
        dto.setAvailableStatus(review.getAvailableStatus());
    
        if (review.getUser() != null) {
            UsersDTO userDTO = Converter.convertUserToUserDTO(review.getUser());
            dto.setUser(userDTO);
        }
    
        if (review.getUserReceive() != null) {
            UsersDTO userReceiveDTO = Converter.convertUserToUserDTO(review.getUserReceive());
            dto.setUserReceive(userReceiveDTO);
        }
    
        return dto;
    }

    public Response getReviewsByUserId(Long userId) {
        Response response = new Response();
        try {
            List<Reviews> reviews = reviewsRepository.findByUserId(userId, Sort.by(Sort.Direction.DESC, "dateCreated"));
            List<ReviewsDTO> reviewsDTOs = reviews.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
            response.setStatusCode(200);
            response.setReviewsDTOList(reviewsDTOs);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during fetching reviews: " + e.getMessage());
        }
        return response;
    }

    public Response getReviewsByUserReceiveId(Long userReceiveId) {
        Response response = new Response();
        try {
            List<Reviews> reviews = reviewsRepository.findByUserReceiveId(userReceiveId, Sort.by(Sort.Direction.DESC, "dateCreated"));
            List<ReviewsDTO> reviewsDTOs = reviews.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
            response.setStatusCode(200);
            response.setReviewsDTOList(reviewsDTOs);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during fetching reviews: " + e.getMessage());
        }
        return response;
    }

    public Response getReviewById(Long id) {
        Response response = new Response();
        try {
            Reviews review = reviewsRepository.findById(id)
                    .orElseThrow(() -> new OurException("Review not found"));
            ReviewsDTO reviewDTO = mapToDTO(review);
            response.setStatusCode(200);
            response.setReviewsDTO(reviewDTO);
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during fetching review: " + e.getMessage());
        }
        return response;
    }

    public Response deleteReview(Long id) {
        Response response = new Response();
        try {
            Reviews review = reviewsRepository.findById(id)
                    .orElseThrow(() -> new OurException("Review not found"));
            review.setAvailableStatus(AvailableStatus.DELETED);
            reviewsRepository.save(review);
            response.setStatusCode(200);
            response.setMessage("Review deleted successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during review deletion: " + e.getMessage());
        }
        return response;
    }

    public Response updateReview(Long id, ReviewsDTO updateRequest) {
        Response response = new Response();
        try {
            Reviews review = reviewsRepository.findById(id)
                    .orElseThrow(() -> new OurException("Review not found"));
            review.setComment(updateRequest.getComment());
            review.setRating(updateRequest.getRating());
            review.setAvailableStatus(updateRequest.getAvailableStatus());
            review.setDateCreated(updateRequest.getDateCreated());
            Users userReceive = new Users();
            userReceive.setId(updateRequest.getUserReceive().getId());
            review.setUserReceive(userReceive);
            reviewsRepository.save(review);
            response.setStatusCode(200);
            response.setMessage("Review updated successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during review update: " + e.getMessage());
        }
        return response;
    }

    public Response getAllReviews() {
        Response response = new Response();
        try {
            List<Reviews> reviews = reviewsRepository.findAll(Sort.by(Sort.Direction.DESC, "dateCreated"));
            List<ReviewsDTO> reviewsDTOs = reviews.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
            response.setStatusCode(200);
            response.setReviewsDTOList(reviewsDTOs);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during fetching reviews: " + e.getMessage());
        }
        return response;
    }
}
