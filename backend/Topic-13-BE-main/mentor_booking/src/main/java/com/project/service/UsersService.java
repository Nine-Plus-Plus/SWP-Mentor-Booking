package com.project.service;

import com.project.dto.*;
import com.project.enums.AvailableStatus;
import com.project.exception.OurException;
import com.project.model.*;
import com.project.model.Class;
import com.project.repository.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import com.project.security.AwsS3Service;
import com.project.ultis.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 *
 * @author Thịnh Đạt
 */
@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private MentorsRepository mentorsRepository;

    @Autowired
    private StudentsRepository studentsRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MentorsService mentorsService;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private AwsS3Service awsS3Service;

    // Phương thức tạo user
    public Response createUser(UsersDTO registerRequest) {
        Response response = new Response();
        try {
            // Kiểm tra nếu username hoặc email đã tồn tại
            if (usersRepository.findByUsernameAndAvailableStatus(registerRequest.getUsername(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("Username already exists");
            }
            if (usersRepository.findByEmailAndAvailableStatus(registerRequest.getEmail(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("Email already exists");
            }

            Role role = roleRepository.findByRoleName(registerRequest.getRoleString())
                    .orElseThrow(() -> new OurException("No role name: " + registerRequest.getRole().getRoleName()));
            // Mã hóa mật khẩu
            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword().trim());

            // Tạo đối tượng User mới
            Users newUser = new Users();
            newUser.setUsername(registerRequest.getUsername().trim());
            newUser.setEmail(registerRequest.getEmail().trim());
            newUser.setPassword(encodedPassword);
            newUser.setFullName(registerRequest.getFullName().trim());
            newUser.setBirthDate(registerRequest.getBirthDate());
            newUser.setAvatar(registerRequest.getAvatar());
            newUser.setAddress(registerRequest.getAddress().trim());
            newUser.setPhone(registerRequest.getPhone().trim());
            newUser.setGender(registerRequest.getGender());
            newUser.setDateCreated(LocalDateTime.now());
            newUser.setAvailableStatus(AvailableStatus.ACTIVE);
            newUser.setRole(role);
            newUser.setAvailableStatus(AvailableStatus.ACTIVE);

            // Lưu người dùng vào database
            usersRepository.save(newUser);
            if (newUser.getId() > 0) {
                UsersDTO usersDTO = Converter.convertUserToUserDTO(newUser);
                response.setUsersDTO(usersDTO);
                response.setStatusCode(200);
                response.setMessage("User created successfully");
            }

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during user creation: " + e.getMessage());
        }
        return response;
    } // done

    // Phương thức tạo học sinh
    public Response createStudents(CreateStudentRequest request) {
        Response response = new Response();
        try {
            // Kiểm tra nếu username hoặc email đã tồn tại
            if (usersRepository.findByUsernameAndAvailableStatus(request.getUsername(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("Username already exists");
            }
            // Kiểm tra email
            if (usersRepository.findByEmailAndAvailableStatus(request.getEmail(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("Email already exists");
            }
            if (usersRepository.findByPhoneAndAvailableStatus(request.getPhone(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("Phone already exists");
            }
            if (studentsRepository.findByStudentCodeAndAvailableStatus(request.getStudentCode(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("StudentCode already exists");
            }
            // Kiểm tra Class
            Class aClass = classRepository.findById(request.getAClass().getId())
                    .orElseThrow(() -> new OurException("Class not found"));
            // Kiểm tra Role
            Role role = roleRepository.findByRoleName("STUDENT")
                    .orElseThrow(() -> new OurException("No role name"));
            // Mã hóa mật khẩu
            String encodedPassword = passwordEncoder.encode(request.getPassword().trim());

            // Tạo đối tượng User mới
            Users newUser = new Users();
            newUser.setUsername(request.getUsername().trim());
            newUser.setEmail(request.getEmail().trim());
            newUser.setPassword(encodedPassword);
            newUser.setFullName(request.getFullName().trim());
            newUser.setBirthDate(request.getBirthDate());
            newUser.setAddress(request.getAddress().trim());
            newUser.setPhone(request.getPhone().trim());
            newUser.setGender(request.getGender());
            newUser.setDateCreated(LocalDateTime.now());
            newUser.setRole(role);
            newUser.setAvailableStatus(AvailableStatus.ACTIVE);
            try {
                if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
                    String avatarUrl = awsS3Service.saveImageToS3(request.getAvatarFile());
                    newUser.setAvatar(avatarUrl);
                }else{
                    newUser.setAvatar("https://mentor-booking-images.s3.amazonaws.com/images.jpeg");
                }
            } catch (Exception e) {
                throw new OurException("Error uploading avatar: " + e.getMessage());
            }
            // Lưu người dùng vào database
            usersRepository.save(newUser);
            if (newUser.getId() > 0) {
                // Tạo đối tượng Student mới
                Students student = new Students();
                student.setUser(newUser);
                student.setExpertise(request.getExpertise().trim());
                student.setStudentCode(request.getStudentCode().trim());
                student.setDateCreated(LocalDate.now());
                student.setPoint(100);
                student.setAClass(aClass);
                student.setGroupRole(null);
                student.setAvailableStatus(AvailableStatus.ACTIVE);
                student.setGroup(null); // Để group_id null
                studentsRepository.save(student);
                newUser.setStudent(student);
                usersRepository.save(newUser);
                if (student.getId() > 0) {
                    StudentsDTO studentsDTO = Converter.convertStudentToStudentDTO(student);
                    response.setStudentsDTO(studentsDTO);
                    response.setStatusCode(200);
                    response.setMessage("Student created successfully");
                }
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during student creation: " + e.getMessage());
        }
        return response;
    } // done

    // Phương thức tạo mentor
    public Response createMentors(CreateMentorRequest request) {
        Response response = new Response();
        try {
            // Kiểm tra nếu username hoặc email đã tồn tại
            if (usersRepository.findByUsernameAndAvailableStatus(request.getUsername(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("Username already exists");
            }
            // Kiểm tra email
            if (usersRepository.findByEmailAndAvailableStatus(request.getEmail(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("Email already exists");
            }
            if (usersRepository.findByPhoneAndAvailableStatus(request.getPhone(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("Phone already exists");
            }
            if (mentorsRepository.findByMentorCodeAndAvailableStatus(request.getMentorCode(), AvailableStatus.ACTIVE).isPresent()) {
                throw new OurException("MentorCode already exists");
            }
            // Kiểm tra Role
            Role role = roleRepository.findByRoleName("MENTOR")
                    .orElseThrow(() -> new OurException("No role name"));
            // Mã hóa mật khẩu
            String encodedPassword = passwordEncoder.encode(request.getPassword().trim());
            // Tạo đối tượng User mới
            Users newUser = new Users();
            newUser.setUsername(request.getUsername().trim());
            newUser.setEmail(request.getEmail().trim());
            newUser.setPassword(encodedPassword);
            newUser.setFullName(request.getFullName().trim());
            newUser.setBirthDate(request.getBirthDate());
            newUser.setAddress(request.getAddress().trim());
            newUser.setPhone(request.getPhone().trim());
            newUser.setGender(request.getGender());
            newUser.setDateCreated(LocalDateTime.now());
            newUser.setRole(role);
            newUser.setAvailableStatus(AvailableStatus.ACTIVE);
            try {
                if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
                    String avatarUrl = awsS3Service.saveImageToS3(request.getAvatarFile());
                    newUser.setAvatar(avatarUrl);
                }else{
                    newUser.setAvatar("https://mentor-booking-images.s3.amazonaws.com/images.jpeg");
                }
            } catch (Exception e) {
                throw new OurException("Error uploading avatar: " + e.getMessage());
            }
            // Lưu người dùng vào database
            usersRepository.save(newUser);
            if (newUser.getId() > 0) {
                // Tạo đối tượng Mentor mới
                Mentors mentor = new Mentors();
                mentor.setUser(newUser);
                mentor.setMentorCode(request.getMentorCode().trim());
                mentor.setStar(5);
                mentor.setTotalTimeRemain(150);
                mentor.setDateCreated(LocalDate.now());
                mentor.setAvailableStatus(AvailableStatus.ACTIVE);
                List<SkillsDTO> skillsListDTO = request.getSkills();
                List<Skills> skillsList = skillsListDTO.stream()
                        .map(Converter::convertSkillDTOToSkill)
                        .collect(Collectors.toList());
                mentor.setSkills(skillsList);
                mentorsRepository.save(mentor);
                newUser.setMentor(mentor);
                usersRepository.save(newUser);

                if (mentor.getId() > 0) {
                    MentorsDTO mentorsDTO = Converter.convertMentorToMentorDTO(mentor);
                    response.setMentorsDTO(mentorsDTO);
                    response.setStatusCode(200);
                    response.setMessage("Mentor created successfully");
                }
            }

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during user creation: " + e.getMessage());
        }
        return response;
    }

    // Phương thức trả về tất cả người dùng
    public Response getAllUser() {
        Response response = new Response();
        try {
            List<Users> list = usersRepository.findByAvailableStatus(AvailableStatus.ACTIVE);
            List<UsersDTO> listDTO = new ArrayList<>();
            if (!list.isEmpty()) {
                listDTO = list.stream()
                        .map(Converter::convertUserToUserDTO)
                        .collect(Collectors.toList());

                response.setUsersDTOList(listDTO);
                response.setStatusCode(200);
                response.setMessage("Users fetched successfully");
            } else {
                response.setUsersDTOList(listDTO);
                response.setMessage("No data found");
                response.setStatusCode(400);
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during get all user " + e.getMessage());
        }

        return response;
    }

    // Phương thức tìm người dùng theo id
    public Response getUserById(Long id) {
        Response response = new Response();
        try {
            Users user = usersRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            UsersDTO userDTO = new UsersDTO();
            if (user != null) {
                userDTO = Converter.convertUserToUserDTO(user);
                response.setUsersDTO(userDTO);
                response.setStatusCode(200);
                response.setMessage("Successfully");
            } else {
                response.setUsersDTO(userDTO);
                response.setMessage("No data found");
                response.setStatusCode(400);
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage("Error occurred during get user by id " + id);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during get user by id " + id);
        }
        return response;
    }

    // Phương thức xóa người dùng theo id
    public Response deleteUser(Long id) {
        Response response = new Response();
        try {
            Users user = usersRepository.findById(id)
                    .orElseThrow(
                            () -> new OurException("User not found with id: " + id));

            Mentors deleteMentor = mentorsRepository.findByUser_Id(user.getId());
            if (deleteMentor != null) {
                deleteMentor.setAvailableStatus(AvailableStatus.DELETED);
                mentorsRepository.save(deleteMentor);
            }

            Students deleteStudent = studentsRepository.findByUser_Id(user.getId());
            if (deleteStudent != null) {
                deleteStudent.setAvailableStatus(AvailableStatus.DELETED);
                studentsRepository.save(deleteStudent);
            }
            user.setAvailableStatus(AvailableStatus.DELETED);
            usersRepository.save(user);
            response.setStatusCode(200);
            response.setMessage("User deleted successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while deleting user: " + id);
        }
        return response;
    } // done

    // Phương thức lấy thông tin profile của người dùng dựa trên email
    public Response getMyProfile(String username) {
        Response response = new Response();
        try {
            Users userProfile = usersRepository.findByUsernameAndAvailableStatus(username, AvailableStatus.ACTIVE)
                    .orElseThrow(() -> new OurException("User not found"));
            if (userProfile.getRole().getRoleName().equalsIgnoreCase("STUDENT")) {
                Students student = studentsRepository.findByUser_Id(userProfile.getId());

                UsersDTO mentorUserDTO = mentorsService.getMentorInformation(student.getAClass().getMentor().getId());
                // Kiểm tra nếu sinh viên có group và group ID không null
                if (student.getGroup() != null && student.getGroup().getId() != null) {
                    Group group = groupRepository.findByIdAndAvailableStatus(student.getGroup().getId(), AvailableStatus.ACTIVE);
                    GroupDTO groupDTO = Converter.convertGroupToGroupDTO(group);
                    response.setGroupDTO(groupDTO);
                }
                // Kiểm tra nếu mentor ID không null trước khi lấy kỹ năng của mentor
                if (student.getAClass().getMentor().getId() != null && student.getAClass().getMentor().getSkills().isEmpty()) {
                    List<SkillsDTO> skillsDTOList = mentorsService.getSkillsByMentor(student.getAClass().getMentor().getId());
                    response.setSkillsDTOList(skillsDTOList);
                }
                // Gán thông tin sinh viên và mentor vào response
                response.setUsersDTO(mentorUserDTO);
                response.setStudentsDTO(Converter.convertStudentToStudentDTO(student));
                response.setStatusCode(200);
                response.setMessage("Successfully");
            } else if (userProfile.getRole().getRoleName().equalsIgnoreCase("MENTOR")) {
                Mentors mentor = mentorsRepository.findByUser_Id(userProfile.getId());
                response.setMentorsDTO(Converter.convertMentorToMentorDTO(mentor));
                response.setStatusCode(200);
                response.setMessage("Successfully");
            } else {
                response.setStatusCode(400);
                response.setMessage("User not found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while getting user profile: " + e.getMessage());
        }
        return response;
    }

    // Phương thức lấy thông tin detail của người dùng dựa trên id
    public Response viewDetailUser(Long id) {
        Response response = new Response();
        try {
            UsersDTO usersDTO = new UsersDTO();
            StudentsDTO studentsDTO = new StudentsDTO();
            MentorsDTO mentorsDTO = new MentorsDTO();

            Users userProfile = usersRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            if (userProfile == null) {
                response.setUsersDTO(usersDTO);
                response.setStatusCode(400);
                response.setMessage("User not found");
                return response;
            }

            if (userProfile.getRole().getRoleName().equalsIgnoreCase("STUDENT")) {
                Students student = studentsRepository.findByUser_Id(userProfile.getId());

                // Kiểm tra nếu sinh viên có group và group ID không null
                if (student.getGroup() != null && student.getGroup().getId() != null) {
                    Group group = groupRepository.findByIdAndAvailableStatus(student.getGroup().getId(), AvailableStatus.ACTIVE);
                    GroupDTO groupDTO = Converter.convertGroupToGroupDTO(group);
                    response.setGroupDTO(groupDTO);
                }
                studentsDTO = Converter.convertStudentToStudentDTO(student);
                response.setStudentsDTO(studentsDTO);
                response.setStatusCode(200);
                response.setMessage("Successfully");
            } else if (userProfile.getRole().getRoleName().equalsIgnoreCase("MENTOR")) {
                Mentors mentor = mentorsRepository.findByUser_Id(userProfile.getId());
                mentorsDTO = Converter.convertMentorToMentorDTO(mentor);
                response.setMentorsDTO(mentorsDTO);
                response.setStatusCode(200);
                response.setMessage("Successfully");
            } else {
                response.setUsersDTO(usersDTO);
                response.setStatusCode(400);
                response.setMessage("User not found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while getting user profile: " + e.getMessage());
        }
        return response;
    }
}
