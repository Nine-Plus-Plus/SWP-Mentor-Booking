package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.enums.AvailableStatus;
import com.project.enums.BookingStatus;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingDTO {
    private Long id;
    private BookingStatus status;
    private int pointPay;
    private LocalDateTime duration;
    private LocalDateTime dateUpdated;
    private LocalDateTime dateCreated;
    private LocalDateTime expiredTime;
    private GroupDTO group;
    private MentorsDTO mentor;
    private MeetingDTO meeting;
    private MentorScheduleDTO mentorSchedule;
    private List<PointHistoryDTO> pointHistories;
    private AvailableStatus availableStatus;
    private List<NotificationsDTO> notificationsDTOList;
}
