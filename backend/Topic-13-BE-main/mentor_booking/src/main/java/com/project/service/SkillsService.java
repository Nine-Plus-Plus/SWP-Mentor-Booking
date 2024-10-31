package com.project.service;

import com.project.dto.Response;
import com.project.dto.SkillsDTO;
import com.project.enums.AvailableStatus;
import com.project.exception.OurException;
import com.project.model.Skills;
import com.project.repository.SkillsRepository;
import com.project.ultis.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SkillsService {

    @Autowired
    private SkillsRepository skillsRepository;

    // Phương thức tạo skill mới
    public Response createSkill(SkillsDTO skillsDTO) {
        Response response = new Response();
        try {

            if (skillsRepository.findBySkillName(skillsDTO.getSkillName(), AvailableStatus.ACTIVE) !=null) {
                throw new OurException("Name already exists");
            }

            Skills newSkill = new Skills();
            newSkill.setSkillName(skillsDTO.getSkillName().trim());
            newSkill.setSkillDescription(skillsDTO.getSkillDescription());
            newSkill.setAvailableStatus(AvailableStatus.ACTIVE);

            skillsRepository.save(newSkill);

            if(newSkill.getId()>0){
                response.setSkillsDTO(Converter.convertSkillToSkillDTO(newSkill));
                response.setStatusCode(200);
                response.setMessage("Skill created successfully");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while creating skill: " + e.getMessage());
        }

        return response;
    }

    // Phương thức lấy tất cả skills
    public Response getAllSkills(String name) {
        Response response = new Response();
        try {
            List<Skills> skillsList;
            if(name == null ||name.isEmpty()){
                skillsList = skillsRepository.findByAvailableStatus(AvailableStatus.ACTIVE);
            }else{
                skillsList = skillsRepository.findByskillNameAndAvailableStatus(name, AvailableStatus.ACTIVE);
            }
            List<SkillsDTO> skillsDTOList = new ArrayList<>();

            skillsDTOList = skillsList
                    .stream()
                    .map(Converter::convertSkillToSkillDTO)
                    .collect(Collectors.toList());
            if(!skillsDTOList.isEmpty()){
                response.setSkillsDTOList(skillsDTOList);
                response.setStatusCode(200);
                response.setMessage("Skills fetched successfully");
            }else{
                response.setSkillsDTOList(skillsDTOList);
                response.setStatusCode(400);
                response.setMessage("No data found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching skills: " + e.getMessage());
        }

        return response;
    }

    // Phương thức lấy skill theo ID
    public Response getSkillById(Long id) {
        Response response = new Response();
        try {
            Skills skill = skillsRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            SkillsDTO skillsDTO = new SkillsDTO();
            if(skill!=null){
                skillsDTO = Converter.convertSkillToSkillDTO(skill);
                response.setSkillsDTO(skillsDTO);
                response.setStatusCode(200);
                response.setMessage("Skill fetched successfully");
            }else{
                response.setSkillsDTO(skillsDTO);
                response.setStatusCode(400);
                response.setMessage("No data found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching skill: " + e.getMessage());
        }

        return response;
    }

    // Phương thức lấy skill theo Name
    public Response findSkillByNName(String skillName) {
        Response response = new Response();
        try {
            Skills skill = skillsRepository.findBySkillName(skillName, AvailableStatus.ACTIVE);
            SkillsDTO skillsDTO = new SkillsDTO();

            if(skill !=null){
                skillsDTO = Converter.convertSkillToSkillDTO(skill);
                response.setSkillsDTO(skillsDTO);
                response.setStatusCode(200);
                response.setMessage("Skill fetched successfully");
            }else{
                response.setSkillsDTO(skillsDTO);
                response.setStatusCode(400);
                response.setMessage("No data found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetching skill: " + e.getMessage());
        }

        return response;
    }

    // Phương thức cập nhật skill
    public Response updateSkill(Long id, SkillsDTO skillsDTO) {
        Response response = new Response();
        try {
            Skills skill = skillsRepository.findById(id).orElseThrow(() -> new OurException("Skill not found"));
            skill.setSkillName(skillsDTO.getSkillName().trim());
            skill.setSkillDescription(skillsDTO.getSkillDescription());
            skillsRepository.save(skill);

            response.setSkillsDTO(Converter.convertSkillToSkillDTO(skill));
            response.setStatusCode(200);
            response.setMessage("Skill updated successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while updating skill: " + e.getMessage());
        }

        return response;
    }

    // Phương thức xóa skill theo ID
    public Response deleteSkill(Long id) {
        Response response = new Response();
        try {
            Skills skill = skillsRepository.findById(id).orElseThrow(() -> new OurException("Skill not found"));
            skill.setAvailableStatus(AvailableStatus.DELETED);
            skillsRepository.save(skill);

            response.setStatusCode(200);
            response.setMessage("Skill deleted successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while deleting skill: " + e.getMessage());
        }

        return response;
    }
}
