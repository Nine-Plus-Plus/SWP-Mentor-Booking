
package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

import com.project.enums.AvailableStatus;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {
    private int statusCode;
    private String message;
    private String token;
    private String expirationTime;
    private String email;
    private String username;
    private String password;
    private String role;
    private String newPassword;
    private BookingDTO bookingDTO;
    private List<BookingDTO> bookingDTOList;
    private ClassDTO classDTO;
    private List<ClassDTO> classDTOList;
    private GroupDTO groupDTO;
    private List<GroupDTO> groupDTOList;
    private MeetingDTO meetingDTO;
    private List<MeetingDTO> meetingDTOList;
    private MentorScheduleDTO mentorScheduleDTO;
    private List<MentorScheduleDTO> mentorScheduleDTOList;
    private MentorsDTO mentorsDTO;
    private List<MentorsDTO> mentorsDTOList;
    private NotificationsDTO notificationsDTO;
    private List<NotificationsDTO> notificationsDTOList;
    private PointHistoryDTO pointHistoryDTO;
    private List<PointHistoryDTO> pointHistoryDTOList;
    private ProjectTasksDTO projectTasksDTO;
    private List<ProjectTasksDTO> projectTasksDTOList;
    private ProjectsDTO projectsDTO;
    private List<ProjectsDTO> projectsDTOList;
    private ReviewsDTO reviewsDTO;
    private List<ReviewsDTO> reviewsDTOList;
    private RoleDTO roleDTO;
    private List<RoleDTO> roleDTOList;
    private SemesterDTO semesterDTO;
    private List<SemesterDTO> semesterDTOList;
    private SkillsDTO skillsDTO;
    private List<SkillsDTO> skillsDTOList;
    private StudentsDTO studentsDTO;
    private List<StudentsDTO> studentsDTOList;
    private TopicDTO topicDTO;
    private List<TopicDTO> topicDTOList;
    private UsersDTO usersDTO;
    private List<UsersDTO> usersDTOList;
    private AvailableStatus availableStatus;
    private String otpCode;
}
