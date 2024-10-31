package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.enums.MeetingStatus;
import com.project.model.Meeting;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    Meeting findByBookingIdAndAvailableStatus(Long bookingId, AvailableStatus availableStatus);

    @Query("SELECT m FROM Meeting m WHERE m.booking.mentor.user.id = :userId OR EXISTS (SELECT s FROM m.booking.group.students s WHERE s.user.id = :userId) ORDER BY m.dateCreated DESC")
    List<Meeting> findMeetingsByUserId(@Param("userId") Long userId);
    
    Meeting findByIdAndAvailableStatus(Long id, AvailableStatus availableStatus);
    
    @Query("SELECT m FROM Meeting m WHERE m.status = :meetingStatus AND m.booking.mentorSchedule.availableTo < :currentDateTime")
    List<Meeting> findAllByStatusAndAvailableToBefore(
        @Param("meetingStatus") MeetingStatus meetingStatus, 
        @Param("currentDateTime") LocalDateTime currentDateTime
    );
}
