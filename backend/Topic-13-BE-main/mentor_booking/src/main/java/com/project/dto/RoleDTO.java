
package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

import com.project.enums.AvailableStatus;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoleDTO {
    private Long id;
    private String roleName;
    private String roleDescription;
    private List<UsersDTO> listUser;
    private AvailableStatus availableStatus;
}
