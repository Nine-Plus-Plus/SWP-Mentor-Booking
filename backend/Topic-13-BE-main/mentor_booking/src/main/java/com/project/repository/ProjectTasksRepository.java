package com.project.repository;
import com.project.enums.AvailableStatus;
import com.project.model.ProjectTasks;
import com.project.model.Projects;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectTasksRepository extends JpaRepository<ProjectTasks, Long> {

    List<ProjectTasks> findByAvailableStatus(AvailableStatus active);
      @Query("SELECT pt FROM ProjectTasks pt WHERE pt.projects = :project AND pt.availableStatus = :availableStatus")
    List<ProjectTasks> findByProjectsAndAvailableStatus(@Param("project") Projects project, @Param("availableStatus") AvailableStatus availableStatus);

}