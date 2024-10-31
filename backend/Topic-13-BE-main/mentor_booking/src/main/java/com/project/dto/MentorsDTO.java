
package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.util.List;

import com.project.enums.AvailableStatus;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MentorsDTO {
    private Long id;
    private float star;
    private String mentorCode;
    private float totalTimeRemain;
    private LocalDate dateCreated;
    private LocalDate dateUpdated;
    private UsersDTO user;
    private List<SkillsDTO> skills;
    private List<BookingDTO> bookings;
    private List<MentorScheduleDTO> mentorSchedules;
    private ClassDTO assignedClass;
    private List<TopicDTO> topicDTOS;
    private List<TopicDTO> topicDTOSForSubMentor;
    private AvailableStatus availableStatus;

    private List<MentorScheduleDTO> mentorScheduleDTOList;
}
