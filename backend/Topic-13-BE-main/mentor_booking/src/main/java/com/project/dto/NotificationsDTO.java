package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.enums.AvailableStatus;
import com.project.enums.NoficationType;
import java.time.LocalDateTime;

import com.project.enums.NotificationAction;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationsDTO {
    private Long id;
    private NoficationType type;
    private NotificationAction action;
    private String message;
    private LocalDateTime dateTimeSent;
    private UsersDTO sender;
    private UsersDTO reciver;
    private AvailableStatus availableStatus;
    private BookingDTO bookingDTO;
    private GroupDTO groupDTO;

    private StudentsDTO studentsDTO;
}
