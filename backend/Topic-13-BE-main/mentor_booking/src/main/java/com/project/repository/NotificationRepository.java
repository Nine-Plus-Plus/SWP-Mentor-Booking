
package com.project.repository;


import com.project.model.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notifications, Long>{

    @Query("SELECT n FROM Notifications n " +
            "WHERE n.receiver.id = :id " +
            "ORDER BY n.dateTimeSent DESC")
    List<Notifications> findByReceiverIdOrderByDateTimeSentDesc(Long id);

}
