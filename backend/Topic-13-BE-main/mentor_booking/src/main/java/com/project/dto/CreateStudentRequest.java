package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.enums.Gender;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateStudentRequest {
    //User
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
    private MultipartFile avatarFile;

    //Student
    private String className;
    private String expertise;
    private String studentCode;
    private int point;
    private LocalDate dateUpdatedStudent;
    private LocalDate dateCreatedStudent;
    private UsersDTO user;
    private GroupDTO group;  // Mỗi sinh viên chỉ thuộc 1 nhóm
    private ClassDTO aClass;
}
