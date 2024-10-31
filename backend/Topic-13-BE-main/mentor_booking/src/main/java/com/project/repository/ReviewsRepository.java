package com.project.repository;

import com.project.enums.AvailableStatus;
import com.project.model.Reviews;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, Long>{
    List<Reviews> findByAvailableStatus(AvailableStatus availableStatus, Sort sort);
    List<Reviews> findByUserId(Long userId, Sort sort);
    List<Reviews> findByUserReceiveId(Long userReceiveId, Sort sort);
}
