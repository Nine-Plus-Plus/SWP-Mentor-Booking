
package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.model.Mentors;

import java.util.List;
import java.util.Optional;

import com.project.model.Skills;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MentorsRepository extends JpaRepository<Mentors, Long>{
    Mentors findByUser_Id(Long userId);

    Optional<Mentors> findByMentorCodeAndAvailableStatus(String mentorCode, AvailableStatus availableStatus);

    List<Mentors> findByAvailableStatus(AvailableStatus availableStatus);

    Mentors findByIdAndAvailableStatus(Long id, AvailableStatus availableStatus);

    @Query("SELECT m FROM Mentors m WHERE m.user.fullName LIKE %:name% AND m.availableStatus = :availableStatus")
    List<Mentors> findByName(
            String name,
            AvailableStatus availableStatus);

    @Query("SELECT DISTINCT m FROM Mentors m JOIN m.skills s WHERE s IN :skills AND m.availableStatus = :availableStatus")
    List<Mentors> findBySkills(
            List<Skills> skills,
            AvailableStatus availableStatus);

    @Query("SELECT m FROM Mentors m WHERE m.user.fullName = :name AND m.availableStatus = :availableStatus")
    Optional<Mentors> findByNameForTopic(String name, AvailableStatus availableStatus);

    @Query("SELECT m FROM Mentors m " +
            "LEFT JOIN m.bookings b " +
            "LEFT JOIN b.meeting mt " +
            "WHERE m.availableStatus = :availableStatus " +
            "GROUP BY m " +
            "ORDER BY m.star DESC, COUNT(b.id) DESC, COUNT(mt.id) DESC")
    List<Mentors> findTopMentors(Pageable pageable, @Param("availableStatus") AvailableStatus availableStatus);
}
