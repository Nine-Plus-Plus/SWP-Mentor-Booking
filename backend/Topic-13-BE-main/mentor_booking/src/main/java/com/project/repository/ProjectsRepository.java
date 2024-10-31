
package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.model.Projects;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectsRepository extends JpaRepository<Projects, Long>{
    List<Projects> findByAvailableStatus (AvailableStatus availableStatus);
    
    Projects findByIdAndAvailableStatus (Long id, AvailableStatus availableStatus);
    
    @Query("SELECT p FROM Projects p WHERE p.group.id = :groupId AND p.availableStatus = :availableStatus")
    List<Projects> findByGroupIdAndAvailableStatus(@Param("groupId") Long groupId, @Param("availableStatus") AvailableStatus availableStatus);

}

