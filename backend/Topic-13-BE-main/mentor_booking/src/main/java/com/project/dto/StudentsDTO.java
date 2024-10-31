
package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;

import com.project.enums.AvailableStatus;
import com.project.enums.GroupRole;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentsDTO {
    private Long id;
    private String expertise;
    private String studentCode;
    private int point;
    private LocalDate dateUpdated;
    private LocalDate dateCreated;
    private UsersDTO user;
    private GroupDTO group;  // Mỗi sinh viên chỉ thuộc 1 nhóm
    private ClassDTO aClass;
    private GroupRole groupRole;
    private AvailableStatus availableStatus;
}
