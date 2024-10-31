package com.project.model;

import com.project.enums.AvailableStatus;
import com.project.enums.NoficationType;
import com.project.enums.NotificationAction;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "notifications")
public class Notifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private NoficationType type;
    
    @Column(name = "action")
    @Enumerated(EnumType.STRING)
    private NotificationAction action;
    
    @Column(name = "message", columnDefinition = "LONGTEXT")
    private String message;
    
    @Column(name = "date_Time_sent")
    private LocalDateTime dateTimeSent;
    
    @ManyToOne
    @JoinColumn(name = "sender_id") // Thiết lập cột khóa ngoại
    private Users sender;

    // Thêm thông tin người nhận
    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private Users receiver;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(name = "available_status")
    private AvailableStatus availableStatus;
}
