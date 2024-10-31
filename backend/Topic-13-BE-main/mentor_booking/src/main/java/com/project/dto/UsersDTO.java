
package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.enums.AvailableStatus;
import com.project.enums.Gender;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsersDTO {
    private Long id;
    private String email;
    private String username;
    private String password;
    private String fullName;
    private String roleString;
    private LocalDate birthDate;
    private String avatar;
    private String address;
    private String phone;
    private Gender gender;
    private LocalDateTime dateUpdated;
    private LocalDateTime dateCreated;
    private RoleDTO role;
    private List<NotificationsDTO> notifications;
    private List<ReviewsDTO> reviews;
    private StudentsDTO student;
    private MentorsDTO mentor;
    private CreateStudentRequest createStudentRequest;
    private AvailableStatus availableStatus;
    private String otpCode;
}
