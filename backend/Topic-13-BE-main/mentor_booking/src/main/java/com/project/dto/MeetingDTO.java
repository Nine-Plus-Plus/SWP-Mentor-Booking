
package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.enums.AvailableStatus;
import com.project.enums.MeetingStatus;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MeetingDTO {
    private Long id;
    private MeetingStatus status;
    private String linkURL;
    private LocalDateTime dateCreated;
    private BookingDTO booking;
    private AvailableStatus availableStatus;
    private List<ReviewsDTO> reviews;
}
