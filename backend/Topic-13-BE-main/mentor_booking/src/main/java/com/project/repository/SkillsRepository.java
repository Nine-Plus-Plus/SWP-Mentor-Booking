
package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.model.Skills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillsRepository extends JpaRepository<Skills, Long>{

    @Query("SELECT s FROM Skills s WHERE s.skillName = :skillName AND s.availableStatus = :availableStatus")
    Skills findBySkillName(
            @Param("skillName")String skillName,
            @Param("availableStatus") AvailableStatus status);

    List<Skills> findByAvailableStatus(AvailableStatus availableStatus);

    @Query("SELECT s FROM Skills s " +
            "WHERE s.skillName LIKE %:skillName% " +
            "AND s.availableStatus = :availableStatus")
    List<Skills> findByskillNameAndAvailableStatus(
            @Param("skillName")String skillName,
            @Param("availableStatus") AvailableStatus status);

    @Query("SELECT s FROM Skills s WHERE s.skillName = :skillName AND s.availableStatus = :availableStatus")
    Optional<Skills> findBySkillNameExcel(
            @Param("skillName") String skillName,
            @Param("availableStatus") AvailableStatus status);

    @Query("SELECT s FROM Skills s WHERE s.id = :id AND s.availableStatus = :availableStatus")
    Skills findByIdAndAvailableStatus(
            @Param("id") Long id,
            @Param("availableStatus") AvailableStatus status);
}
