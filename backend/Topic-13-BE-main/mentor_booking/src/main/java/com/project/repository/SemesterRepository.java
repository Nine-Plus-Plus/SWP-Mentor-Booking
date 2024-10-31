
package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.model.Semester;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long>{
    Optional<Semester> findById(Long id);

    @Query("SELECT s FROM Semester s WHERE s.semesterName = :semesterName AND s.availableStatus = :availableStatus")
    Optional<Semester> findBySemesterName(@Param("semesterName")String semesterName, @Param("availableStatus") AvailableStatus status);

    List<Semester> findByAvailableStatus(AvailableStatus availableStatus);

    List<Semester> findByAvailableStatusOrderByDateCreatedDesc(AvailableStatus availableStatus);

    @Query("SELECT s FROM Semester s WHERE s.id = :id AND s.availableStatus = :availableStatus")
    Semester findByIdAndAvailableStatus(@Param("id") Long id, @Param("availableStatus") AvailableStatus status);

    @Query("SELECT s FROM Semester s WHERE s.availableStatus = :status AND "
            + "(s.dateStart <= :dateEnd AND s.dateEnd >= :dateStart)")
    List<Semester> findOverlappingSemesters(@Param("dateStart") LocalDate dateStart,
                                            @Param("dateEnd") LocalDate dateEnd,
                                            @Param("status") AvailableStatus status);
}
