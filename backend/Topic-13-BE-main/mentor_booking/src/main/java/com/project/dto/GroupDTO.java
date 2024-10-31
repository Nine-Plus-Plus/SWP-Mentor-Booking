
package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.util.List;

import com.project.enums.AvailableStatus;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GroupDTO {
    private Long id;
    private String groupName;
    private int totalPoint;
    private LocalDate dateCreated;
    private LocalDate dateUpdated;
    private List<StudentsDTO> students;  // Một nhóm có thể chứa nhiều sinh viên
    private ProjectsDTO project;
    private List<BookingDTO> bookings;
    private ClassDTO classDTO;
    private AvailableStatus availableStatus;
    private List<NotificationsDTO> notificationsDTOList;
}
