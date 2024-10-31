
package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.enums.MentorScheduleStatus;
import com.project.model.MentorSchedule;
import com.project.model.Mentors;
import com.project.model.Skills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;


public interface MentorScheduleRepository extends JpaRepository<MentorSchedule, Long>{

    List<MentorSchedule> findByAvailableStatus(AvailableStatus availableStatus);

    MentorSchedule findByIdAndAvailableStatus(Long id, AvailableStatus availableStatus);

    boolean existsByMentorAndAvailableStatusAndAvailableFromLessThanEqualAndAvailableToGreaterThanEqualAndIdNot(
            Mentors mentor,
            AvailableStatus availableStatus,  // Điều kiện trạng thái còn hiệu lực
            LocalDateTime availableTo,
            LocalDateTime availableFrom,
            Long id  // Bỏ qua lịch trình hiện tại
    );


    @Query("SELECT m FROM MentorSchedule m " +
            "WHERE m.mentor.id = :mentorId " +
            "AND m.availableStatus = :availableStatus " +
            "AND m.status = :status " +
            "ORDER BY m.availableFrom ASC")
    List<MentorSchedule> findByMentorIdAndAvailableStatusAndStatus(
            @Param("mentorId") Long mentorId,
            @Param("availableStatus") AvailableStatus availableStatus,
            @Param("status") MentorScheduleStatus status);

    @Query("SELECT m FROM MentorSchedule m " +
            "WHERE m.mentor.id = :mentorId " +
            "AND m.availableStatus = :availableStatus")
    List<MentorSchedule> findByMentorIdAndAvailableStatusForMentor(
            @Param("mentorId") Long mentorId,
            @Param("availableStatus") AvailableStatus availableStatus
    );

    boolean existsByMentorAndAvailableStatusAndAvailableFromLessThanEqualAndAvailableToGreaterThanEqual(
            Mentors mentor,
            AvailableStatus availableStatus,  // Điều kiện trạng thái còn hiệu lực
            LocalDateTime availableTo,
            LocalDateTime availableFrom
    );

    @Query("SELECT ms FROM MentorSchedule ms WHERE ms.availableTo < :now AND ms.status = :status")
    List<MentorSchedule> findByAvailableToBeforeAndStatus(LocalDateTime now, MentorScheduleStatus status);

    //
    @Query("SELECT DISTINCT m.mentor FROM MentorSchedule m " +
            "WHERE m.availableTo <= :availableTo " +
            "AND m.availableStatus = :availableStatus")
    List<Mentors> findMentorsByAvailableTo(
            @Param("availableTo") LocalDateTime availableTo,
            @Param("availableStatus") AvailableStatus availableStatus);

    @Query("SELECT DISTINCT m.mentor FROM MentorSchedule m " +
            "WHERE m.availableFrom >= :availableFrom " +
            "AND m.availableStatus = :availableStatus")
    List<Mentors> findMentorsByAvailableFrom(
            @Param("availableFrom") LocalDateTime availableFrom,
            @Param("availableStatus") AvailableStatus availableStatus);

    @Query("SELECT DISTINCT m FROM Mentors m JOIN m.skills s " +
            "WHERE m.user.fullName LIKE %:name% " +
            "AND s IN :skillsList " +
            "AND m.availableStatus = :availableStatus")
    List<Mentors> findByNameAndSkills(
            @Param("name") String name,
            @Param("skillsList") List<Skills> skillsList,
            @Param("availableStatus") AvailableStatus availableStatus);

    @Query("SELECT DISTINCT m.mentor FROM MentorSchedule m " +
            "WHERE m.availableTo <= :availableTo " +
            "AND m.mentor.user.fullName LIKE %:fullName% " +
            "AND m.availableStatus = :availableStatus")
    List<Mentors> findMentorsByNameAndAvailableTo(
            @Param("fullName") String name,
            @Param("availableTo") LocalDateTime availableTo,
            AvailableStatus availableStatus
    );

    @Query("SELECT DISTINCT m.mentor FROM MentorSchedule m " +
            "WHERE m.availableFrom >= :availableFrom " +
            "AND m.mentor.user.fullName LIKE %:fullName% " +
            "AND m.availableStatus = :availableStatus")
    List<Mentors> findMentorsByNameAndAvailableFrom(
            @Param("fullName") String name,
            @Param("availableFrom") LocalDateTime availableFrom,
            AvailableStatus availableStatus
    );

    @Query("SELECT DISTINCT m FROM MentorSchedule ms JOIN ms.mentor m JOIN m.skills s " +
            "WHERE ms.availableTo <= :availableTo " +
            "AND s IN :skillsList " +
            "AND ms.availableStatus = :availableStatus")
    List<Mentors> findMentorsBySkillsAndAvailableTo(
            @Param("skillsList") List<Skills> skillsList,
            @Param("availableTo") LocalDateTime availableTo,
            @Param("availableStatus") AvailableStatus availableStatus
    );

    @Query("SELECT DISTINCT m FROM MentorSchedule ms JOIN ms.mentor m JOIN m.skills s " +
            "WHERE ms.availableFrom >= :availableFrom " +
            "AND s IN :skillsList " +
            "AND ms.availableStatus = :availableStatus")
    List<Mentors> findMentorsBySkillsAndAvailableFrom(
            @Param("skillsList") List<Skills> skillsList,
            @Param("availableFrom") LocalDateTime availableFrom,
            @Param("availableStatus") AvailableStatus availableStatus
    );

    @Query("SELECT DISTINCT ms.mentor FROM MentorSchedule ms " +
            "WHERE ms.availableFrom >= :availableFrom " +
            "AND ms.availableTo <= :availableTo " +
            "AND ms.availableStatus = :availableStatus")
    List<Mentors> findMentorsByAvailableFromAndTo(
            @Param("availableFrom") LocalDateTime availableFrom,
            @Param("availableTo") LocalDateTime availableTo,
            @Param("availableStatus") AvailableStatus availableStatus
    );

    @Query("SELECT DISTINCT m FROM MentorSchedule ms JOIN ms.mentor m JOIN m.skills s " +
            "WHERE m.user.fullName LIKE %:fullName% " +
            "AND s.id IN :skillIds " +
            "AND ms.availableTo <= :availableTo " +
            "AND ms.availableStatus = :availableStatus")
    List<Mentors> findMentorsByNameSkillsAndAvailableTo(
            @Param("fullName") String name,
            @Param("skillIds") List<Long> skillIds,
            @Param("availableTo") LocalDateTime availableTo,
            @Param("availableStatus") AvailableStatus availableStatus
    );

    @Query("SELECT DISTINCT m FROM MentorSchedule ms JOIN ms.mentor m JOIN m.skills s " +
            "WHERE m.user.fullName LIKE %:fullName% " +
            "AND s.id IN :skillIds " +
            "AND ms.availableFrom >= :availableFrom " +
            "AND ms.availableStatus = :availableStatus")
    List<Mentors> findMentorsByNameSkillsAndAvailableFrom(
            @Param("fullName") String name,
            @Param("skillIds") List<Long> skillIds,
            @Param("availableFrom") LocalDateTime availableFrom,
            @Param("availableStatus") AvailableStatus availableStatus
    );

    @Query("SELECT DISTINCT m FROM MentorSchedule ms JOIN ms.mentor m JOIN m.skills s " +
            "WHERE ms.availableFrom >= :availableFrom " +
            "AND ms.availableTo <= :availableTo " +
            "AND s.id IN :skillIds " +
            "AND ms.availableStatus = :availableStatus")
    List<Mentors> findMentorsBySkillsAndAvailableFromTo(
            @Param("skillIds") List<Long> skillIds,
            @Param("availableFrom") LocalDateTime availableFrom,
            @Param("availableTo") LocalDateTime availableTo,
            @Param("availableStatus") AvailableStatus availableStatus
    );

    @Query("SELECT DISTINCT m FROM MentorSchedule ms JOIN ms.mentor m " +
            "WHERE m.user.fullName LIKE %:name% " + // Tìm kiếm tên mentor
            "AND ms.availableFrom >= :availableFrom " + // Thời gian bắt đầu có sẵn
            "AND ms.availableTo <= :availableTo " + // Thời gian kết thúc có sẵn
            "AND ms.availableStatus = :availableStatus") // Trạng thái có sẵn
    List<Mentors> findMentorsByNameAndAvailableFromTo(
            @Param("name") String name,
            @Param("availableFrom") LocalDateTime availableFrom,
            @Param("availableTo") LocalDateTime availableTo,
            @Param("availableStatus") AvailableStatus availableStatus
    );

    @Query("SELECT DISTINCT m FROM MentorSchedule ms " +
            "JOIN ms.mentor m " +
            "JOIN m.skills s " +
            "WHERE m.user.fullName LIKE %:name% " +
            "AND s.id IN :skillIds " +
            "AND ms.availableFrom >= :availableFrom " +
            "AND ms.availableTo <= :availableTo " +
            "AND ms.availableStatus = :availableStatus")
    List<Mentors> findMentorsByNameSkillsAvailableFromAndTo(
            @Param("name") String name,
            @Param("skillIds") List<Long> skillIds,
            @Param("availableFrom") LocalDateTime availableFrom,
            @Param("availableTo") LocalDateTime availableTo,
            @Param("availableStatus") AvailableStatus availableStatus
    );
}
