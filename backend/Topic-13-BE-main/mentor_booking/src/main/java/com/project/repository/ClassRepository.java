
package com.project.repository;


import com.project.enums.AvailableStatus;
import com.project.model.Class;
import com.project.model.Mentors;
import java.util.List;
import java.util.Optional;

import com.project.model.Mentors;
import com.project.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClassRepository extends JpaRepository<Class, Long>{
    Optional<Class> findByMentorId(Long mentorId);
    Optional<Class> findBySemesterId(Long semesterId);
    Optional<Class> findByClassName(String className);
    boolean existsByClassNameAndSemesterIdAndAvailableStatus(String className, Long semesterId, AvailableStatus availableStatus);

    @Query("SELECT c FROM Class c WHERE c.semester.id = :semesterId AND c.availableStatus = :availableStatus")
    List<Class> findClassBySemesterId(
            @Param("semesterId") Long semesterId,
            @Param("availableStatus") AvailableStatus status );

    @Query("SELECT c FROM Class c " +
            "WHERE c.className LIKE %:className% " +
            "AND c.semester.id = :semesterId " +
            "AND c.availableStatus = :availableStatus")
    List<Class> findClassByClassNameAndSemesterId(
            @Param("semesterId") Long semesterId,
            @Param("className") String name,
            @Param("availableStatus") AvailableStatus status );

    List<Class> findByAvailableStatus(AvailableStatus availableStatus);

    @Query("SELECT c FROM Class c WHERE c.id = :id AND c.availableStatus = :availableStatus")
    Class findByIdAndAvailableStatus(@Param("id") Long id, @Param("availableStatus") AvailableStatus status);

    @Query("SELECT c.mentor FROM Class c WHERE c.availableStatus = :status")
    List<Mentors> findMentorsAssignedToClasses(@Param("status") AvailableStatus status);

//    @Query("SELECT c FROM Class c WHERE c.class_name LIKE %:className%")
    List<Class> findByClassNameContainingIgnoreCase(String className);

    Class findByClassNameContainingIgnoreCaseAndAvailableStatus(String className, AvailableStatus availableStatus);

    Class findByMentorAndAvailableStatus(Mentors mentor, AvailableStatus availableStatus);

}
