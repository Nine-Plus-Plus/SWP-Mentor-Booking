package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.model.Group;
import com.project.model.Class;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("SELECT g FROM Group g WHERE LOWER(g.groupName) = LOWER(:groupName) AND g.aClass.id = :aClassId AND g.availableStatus = :availableStatus")
    Optional<Group> findGroup(
            @Param("groupName") String groupName, 
            @Param("aClassId") Long aClassId, 
            @Param("availableStatus") AvailableStatus availableStatus);
    List<Group> findByAvailableStatus(AvailableStatus availableStatus);
    
    Group findByIdAndAvailableStatus(Long id, AvailableStatus availableStatus);
    
    @Query("SELECT g FROM Group g WHERE g.aClass.id = :classId AND g.availableStatus = :availableStatus")
    List<Group> findGroupsByClassId(Long classId, AvailableStatus availableStatus);
}
