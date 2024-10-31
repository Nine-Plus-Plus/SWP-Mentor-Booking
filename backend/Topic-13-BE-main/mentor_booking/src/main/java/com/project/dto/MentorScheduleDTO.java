
package com.project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.enums.AvailableStatus;
import com.project.enums.MentorScheduleStatus;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MentorScheduleDTO {
    private Long id;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime availableFrom;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime availableTo;
    private MentorScheduleStatus status;
    private MentorsDTO mentor;
    private BookingDTO booking;
    private AvailableStatus availableStatus;
}
