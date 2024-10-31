
package com.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

import com.project.enums.AvailableStatus;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillsDTO {
    private Long id;
    private String skillName;
    private String skillDescription;
    private List<MentorsDTO> mentors;
    private AvailableStatus availableStatus;
}
