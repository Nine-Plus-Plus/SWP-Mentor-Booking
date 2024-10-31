
package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.enums.BookingStatus;
import com.project.model.Booking;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>{
    Booking findByIdAndAvailableStatusAndStatus(Long id, AvailableStatus availableStatus, BookingStatus status);

    Booking findByIdAndAvailableStatus(Long id, AvailableStatus availableStatus);

    List<Booking> findByAvailableStatusAndStatusAndMentorScheduleId(
            AvailableStatus availableStatus, 
            BookingStatus status,
            Long mentorScheduleId);
    
    List<Booking> findByGroupIdAndAvailableStatusAndStatus(
            Long groupId, 
            AvailableStatus availableStatus, 
            BookingStatus status);
    
    List<Booking> findByAvailableStatusAndStatusAndMentorScheduleIdAndGroupId(
            AvailableStatus availableStatus, 
            BookingStatus status,
            Long mentorScheduleId,
            Long groupId);
    
    List<Booking> findByAvailableStatus(AvailableStatus availableStatus);
    
    @Query("SELECT b FROM Booking b WHERE b.group.aClass.id = :classId")
    List<Booking> findBookingsByClassId(
        @Param("classId") Long classId
    );
    
    @Query("SELECT b FROM Booking b " +
       "WHERE b.mentor.id = :mentorId AND b.status = :status " +
       "ORDER BY CASE " +
       "  WHEN b.status = 'PENDING' AND EXISTS (" +
       "    SELECT 1 FROM Booking pb WHERE pb.group.id = b.group.id " +
       "    AND pb.mentor.id = b.mentor.id AND pb.status = 'CANCELLED' AND pb.availableStatus = 'ACTIVE'" +
       "  ) THEN 0 " +
       "  WHEN b.status = 'PENDING' AND b.group.aClass.id = b.mentor.assignedClass.id THEN 1 " +
       "  ELSE 2 " +
       "END, b.dateCreated DESC")
    List<Booking> findBookingsByMentorIdAndStatusHasPriority(
            Long mentorId,
            BookingStatus status
    );
    
    List<Booking> findByGroupIdAndStatusOrderByDateCreatedDesc(
            Long groupId,
            BookingStatus status
    );
    
    List<Booking> findByStatusAndMentorScheduleId(BookingStatus status, Long mentorScheduleId);
    
    @Query("SELECT b FROM Booking b WHERE b.status = :bookingStatus AND b.expiredTime < :currentDateTime")
    List<Booking> findAllByStatusAndExpiredTimeBefore(
        @Param("bookingStatus") BookingStatus bookingStatus, 
        @Param("currentDateTime") LocalDateTime currentDateTime
    );
    
    @Query("SELECT b FROM Booking b WHERE b.status = :bookingStatus AND b.mentorSchedule.availableFrom < :currentDateTime")
    List<Booking> findAllByStatusAndAvailableFromBefore(
        @Param("bookingStatus") BookingStatus bookingStatus, 
        @Param("currentDateTime") LocalDateTime currentDateTime
    );
    
    List<Booking> findByStatus(BookingStatus status);
}
