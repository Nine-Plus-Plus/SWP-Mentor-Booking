package com.project.service;

import com.project.dto.GroupDTO;
import com.project.dto.Response;
import com.project.dto.StudentsDTO;
import com.project.enums.AvailableStatus;
import com.project.enums.GroupRole;
import com.project.exception.OurException;
import com.project.model.Group;
import com.project.model.Semester;
import com.project.model.Students;
import com.project.model.Class;
import com.project.repository.ClassRepository;
import com.project.repository.GroupRepository;
import com.project.repository.SemesterRepository;
import com.project.repository.StudentsRepository;
import com.project.ultis.Converter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Thịnh Đạt
 */
@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private StudentsRepository studentsRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SemesterRepository semesterRepository;

    public Response createGroup(GroupDTO inputRequest) {
        Response response = new Response();
        try {
            if (groupRepository.findGroup(inputRequest.getGroupName(), inputRequest.getClassDTO().getId(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("Group name have existed");
            }
            Group group = new Group();
            group.setGroupName(inputRequest.getGroupName());
            group.setDateCreated(LocalDate.now());
            group.setDateUpdated(LocalDate.now());

            Students student = studentsRepository.findById(inputRequest.getStudents().get(0).getId()).get();
            if (student.getGroup() != null) {
                throw new OurException("The student have a group");
            }
            student.setGroupRole(GroupRole.LEADER);
            student.setGroup(group);
            List<Students> studentsList = new ArrayList<>();
            studentsList.add(student);
            group.setStudents(studentsList);
            group.setTotalPoint(student.getPoint());

            group.setProject(null);

            Class aClass = classRepository.findById(inputRequest.getClassDTO().getId()).get();
            group.setAClass(aClass);

            group.setAvailableStatus(AvailableStatus.ACTIVE);
            groupRepository.save(group);

            if (group.getId() > 0) {
                GroupDTO dto = Converter.convertGroupToGroupDTO(group);
                response.setGroupDTO(dto);
                response.setStatusCode(200);
                response.setMessage("Group created successfully");
            }

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during group creation: " + e.getMessage());
        }
        return response;
    }

    public Response getAllGroups() {
        Response response = new Response();
        try {
            List<Group> groupList = groupRepository.findByAvailableStatus(AvailableStatus.ACTIVE);
            List<GroupDTO> groupListDTO = null;
            if (groupList != null) {
                groupListDTO = groupList.stream()
                        .map(Converter::convertGroupToGroupDTO)
                        .collect(Collectors.toList());
                response.setGroupDTOList(groupListDTO);
                response.setStatusCode(200);
                response.setMessage("Groups fetched successfully");
            } else {
                response.setGroupDTOList(groupListDTO);
                throw new OurException("Cannot find any group");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during get all groups " + e.getMessage());
        }
        return response;
    }

    public Response getGroupById(Long id) {
        Response response = new Response();
        try {
            Group findGroup = groupRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            if (findGroup != null) {
                GroupDTO dto = Converter.convertGroupToGroupDTO(findGroup);
                response.setGroupDTO(dto);
                response.setStatusCode(200);
                response.setMessage("Successfully");
            } else {
                throw new OurException("Cannot find group");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during get group " + e.getMessage());
        }
        return response;
    }

    public Response updateGroup(Long id, Group newGroup) {
        Response response = new Response();
        try {
            Group presentGroup = groupRepository.findById(id)
                    .orElseThrow(() -> new OurException("Cannot find group with id: " + id));

            if (newGroup.getGroupName() != null) {
                presentGroup.setGroupName(newGroup.getGroupName());
            }
            presentGroup.setDateUpdated(LocalDate.now());

            groupRepository.save(presentGroup);

            GroupDTO dto = Converter.convertGroupToGroupDTO(presentGroup);
            response.setGroupDTO(dto);
            response.setStatusCode(200);
            response.setMessage("Group updated successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while updating class: " + e.getMessage());
        }
        return response;
    }

    public Response deleteGroup(Long id) {
        Response response = new Response();
        try {
            Group deleteGroup = groupRepository.findById(id)
                    .orElseThrow(() -> new OurException("Cannot find group with id: " + id));
            deleteGroup.setAvailableStatus(AvailableStatus.DELETED);
            groupRepository.save(deleteGroup);

            response.setStatusCode(200);
            response.setMessage("Group deleted successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while deleting group: " + e.getMessage());
        }
        return response;
    }

    public Response addNewGroupMember(Long id, StudentsDTO newMember) {
        Response response = new Response();
        try {
            Group findGroup = groupRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            if (findGroup != null) {
                Students student = studentsRepository.findByIdAndAvailableStatus(newMember.getId(), AvailableStatus.ACTIVE);
                if (student != null) {
                    if (student.getGroup() != null) {
                        throw new OurException("The student have a group");
                    }
                    List<Students> studentsList = findGroup.getStudents();
                    student.setGroupRole(GroupRole.MEMBER);
                    student.setGroup(findGroup);
                    studentsList.add(student);
                    int currentPoint = findGroup.getTotalPoint();
                    findGroup.setTotalPoint(currentPoint + student.getPoint());
                    studentsRepository.save(student);
                    groupRepository.save(findGroup);
                    response.setStatusCode(200);
                    response.setMessage("New member added successfully");
                } else {
                    throw new OurException("Cannot find student");
                }
            } else {
                throw new OurException("Cannot find group");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during get group " + e.getMessage());
        }
        return response;
    }

    public Response removeMember(Long id, StudentsDTO newMember) {
        Response response = new Response();
        try {
            Group findGroup = groupRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            if (findGroup != null) {
                Students student = studentsRepository.findByIdAndAvailableStatus(newMember.getId(), AvailableStatus.ACTIVE);
                if (student != null) {
                    List<Students> studentsList = findGroup.getStudents();
                    student.setGroupRole(null);
                    student.setGroup(null);
                    studentsList.remove(student);
                    int currentPoint = findGroup.getTotalPoint();
                    findGroup.setTotalPoint(currentPoint - student.getPoint());
                    findGroup.setStudents(studentsList);
                    studentsRepository.save(student);
                    groupRepository.save(findGroup);
                    response.setStatusCode(200);
                    response.setMessage("Member have been removed");
                } else {
                    throw new OurException("Cannot find student");
                }
            } else {
                throw new OurException("Cannot find group");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during get group " + e.getMessage());
        }
        return response;
    }

    public Response getGroupsInClass(Long classId) {
        Response response = new Response();
        try {
            List<Group> groupList = groupRepository.findGroupsByClassId(classId, AvailableStatus.ACTIVE);
            List<GroupDTO> groupListDTO = new ArrayList<>();
            if (groupList != null) {
                groupListDTO = groupList.stream()
                        .map(Converter::convertGroupToGroupDTO)
                        .collect(Collectors.toList());
                response.setGroupDTOList(groupListDTO);
                response.setStatusCode(200);
                response.setMessage("Successfully");
            } else {
                throw new OurException("Cannot find group");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during get group " + e.getMessage());
        }
        return response;
    }

    public Response getGroupBySemesterId(Long semesterId) {
        Response response = new Response();
        try {
            List<Class> findClass = classRepository.findClassBySemesterId(semesterId, AvailableStatus.ACTIVE);

            if (findClass != null && !findClass.isEmpty()) {
                List<GroupDTO> allGroups = new ArrayList<>();
                for (Class c : findClass) {
                    List<Group> groups = groupRepository.findGroupsByClassId(c.getId(), AvailableStatus.ACTIVE);

                    if (groups != null && !groups.isEmpty()) {
                        for (Group group : groups) {
                            GroupDTO groupDTO = Converter.convertGroupToGroupDTO(group); // Hàm chuyển đổi (nếu cần)
                            allGroups.add(groupDTO);
                        }
                    }
                }

                response.setGroupDTOList(allGroups);
                response.setStatusCode(200);
                response.setMessage("Successfully");
            } else {
                throw new OurException("No classes found for this semester.");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during get group: " + e.getMessage());
        }
        return response;
    }
}
