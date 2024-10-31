
package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.model.Students;

import java.util.List;
import java.util.Optional;

import com.project.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentsRepository extends JpaRepository<Students, Long>{
    Optional<Students> findByStudentCodeAndAvailableStatus(String studentCode, AvailableStatus availableStatus);
    Students findByUser_Id(Long userId);

    @Query("SELECT s FROM Students s WHERE s.user.fullName LIKE %:name% AND s.expertise LIKE %:expertise% AND s.availableStatus = :availableStatus AND s.aClass.id = :classId")
    List<Students> findStudentByUserFullNameAndExpertiseAndClassId(
            @Param("name") String name,
            @Param("expertise") String expertise,
            @Param("availableStatus") AvailableStatus status,
            @Param("classId") Long classId);

    @Query("SELECT s FROM Students s WHERE s.user.fullName LIKE %:name% AND s.availableStatus = :availableStatus AND s.aClass.id = :classId")
    List<Students> findStudentByUserFullNameAndClassId(
            @Param("name") String name,
            @Param("availableStatus") AvailableStatus status,
            @Param("classId") Long classId);

    @Query("SELECT s FROM Students s WHERE s.expertise LIKE %:expertise% AND s.availableStatus = :availableStatus AND s.aClass.id = :classId")
    List<Students> findByExpertiseAndClassId(
            @Param("expertise") String expertise,
            @Param("availableStatus") AvailableStatus status,
            @Param("classId") Long classId);

    @Query("SELECT s FROM Students s WHERE s.aClass.id = :classId AND s.availableStatus = :availableStatus")
    List<Students> findStudentByClassId(
            @Param("classId") Long classId,
            @Param("availableStatus") AvailableStatus status);

    @Query("SELECT s FROM Students s " +
            "WHERE s.aClass.id = :classId " +
            "AND s.user.fullName LIKE %:fullName% " +
            "AND s.availableStatus = :availableStatus")
    List<Students> findStudentByClassIdAndFullName(
            @Param("classId") Long classId,
            @Param("fullName") String name,
            @Param("availableStatus") AvailableStatus status);

    List<Students> findByAvailableStatus(AvailableStatus status);

    @Query("SELECT s FROM Students s WHERE s.id = :id AND s.availableStatus = :availableStatus")
    Students findByIdAndAvailableStatus(@Param("id") Long id, @Param("availableStatus") AvailableStatus status);
    
    @Query("SELECT s FROM Students s WHERE s.aClass.id = :classId AND s.availableStatus = :availableStatus AND s.group IS NULL")
    List<Students> findStudentsThatAreNotInGroup(@Param("classId") Long classId, @Param("availableStatus") AvailableStatus availableStatus);
}
