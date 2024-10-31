package com.project.ultis;

import com.project.model.*;
import com.project.model.Class;
import com.project.dto.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class Converter {

    public static ClassDTO convertClassToClassDTO(Class convertClass) {
        ClassDTO classDTO = new ClassDTO();
        classDTO.setId(convertClass.getId());
        classDTO.setClassName(convertClass.getClassName());
        classDTO.setDateCreated(convertClass.getDateCreated());
        classDTO.setAvailableStatus(convertClass.getAvailableStatus());

        if (convertClass.getSemester() != null) {
            classDTO.setSemester(convertSemesterToSemesterDTO(convertClass.getSemester()));
        }
        if (convertClass.getMentor() != null) {
            Mentors mentor = new Mentors();
            mentor.setId(convertClass.getMentor().getId());
            mentor.setMentorCode(convertClass.getMentor().getMentorCode());
            mentor.setDateCreated(convertClass.getMentor().getDateCreated());
            mentor.setStar(convertClass.getMentor().getStar());
            mentor.setTotalTimeRemain(convertClass.getMentor().getTotalTimeRemain());
            mentor.setAvailableStatus(convertClass.getMentor().getAvailableStatus());
            mentor.setSkills(convertClass.getMentor().getSkills());
            if(convertClass.getMentor().getUser() != null){
                mentor.setUser(convertClass.getMentor().getUser());
            }
            classDTO.setMentor(convertMentorToMentorDTO(mentor));
        }

        return classDTO;
    }

    public static SemesterDTO convertSemesterToSemesterDTO(Semester convertSemester) {
        SemesterDTO semesterDTO = new SemesterDTO();
        semesterDTO.setId(convertSemester.getId());
        semesterDTO.setSemesterName(convertSemester.getSemesterName());
        semesterDTO.setDateCreated(convertSemester.getDateCreated());
        semesterDTO.setAvailableStatus(convertSemester.getAvailableStatus());
        semesterDTO.setDateStart(convertSemester.getDateStart());
        semesterDTO.setDateEnd(convertSemester.getDateEnd());
        return semesterDTO;
    }

    public static MentorsDTO convertMentorToMentorDTO(Mentors convertMentor) {
        MentorsDTO mentorsDTO = new MentorsDTO();
        mentorsDTO.setId(convertMentor.getId());
        mentorsDTO.setMentorCode(convertMentor.getMentorCode());
        mentorsDTO.setDateCreated(convertMentor.getDateCreated());
        mentorsDTO.setDateUpdated(convertMentor.getDateUpdated());
        mentorsDTO.setStar(convertMentor.getStar());
        mentorsDTO.setTotalTimeRemain(convertMentor.getTotalTimeRemain());

        mentorsDTO.setAvailableStatus(convertMentor.getAvailableStatus());

        if (convertMentor.getAssignedClass() != null) {
            mentorsDTO.setAssignedClass(convertClassToClassDTO(convertMentor.getAssignedClass()));
        }

        if (convertMentor.getUser() != null) {
            mentorsDTO.setUser(convertUserToUserDTO(convertMentor.getUser()));
        }
        if (convertMentor.getSkills() != null) {
            List<SkillsDTO> skillsDTOList = convertMentor.getSkills().stream()
                    .map(Converter::convertSkillToSkillDTO)
                    .collect(Collectors.toList());
            mentorsDTO.setSkills(skillsDTOList);
        }
        return mentorsDTO;
    }

    public static StudentsDTO convertStudentToStudentDTO(Students convertStudent) {
        StudentsDTO studentsDTO = new StudentsDTO();
        studentsDTO.setId(convertStudent.getId());
        studentsDTO.setStudentCode(convertStudent.getStudentCode());
        studentsDTO.setExpertise(convertStudent.getExpertise());
        studentsDTO.setDateUpdated(convertStudent.getDateUpdated());
        studentsDTO.setDateCreated(convertStudent.getDateCreated());
        studentsDTO.setPoint(convertStudent.getPoint());
        studentsDTO.setGroupRole(convertStudent.getGroupRole());
        if (convertStudent.getAClass() != null) {
            studentsDTO.setAClass(convertClassToClassDTO(convertStudent.getAClass()));
        }

        if (convertStudent.getUser() != null) {
            studentsDTO.setUser(convertUserToUserDTO(convertStudent.getUser()));
        }
        studentsDTO.setAvailableStatus(convertStudent.getAvailableStatus());
        return studentsDTO;
    }

    public static UsersDTO convertUserToUserDTO(Users convertUsers) {
        UsersDTO userDTO = new UsersDTO();
        userDTO.setId(convertUsers.getId());
        userDTO.setEmail(convertUsers.getEmail());
        userDTO.setUsername(convertUsers.getUsername());
        userDTO.setFullName(convertUsers.getFullName());
        userDTO.setBirthDate(convertUsers.getBirthDate());
        userDTO.setAvatar(convertUsers.getAvatar());
        userDTO.setAddress(convertUsers.getAddress());
        userDTO.setPhone(convertUsers.getPhone());
        userDTO.setGender(convertUsers.getGender());
        userDTO.setDateUpdated(convertUsers.getDateUpdated());
        userDTO.setDateCreated(convertUsers.getDateCreated());
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setId(convertUsers.getRole().getId());
        roleDTO.setRoleName(convertUsers.getRole().getRoleName());
        userDTO.setRole(roleDTO);

        userDTO.setAvailableStatus(convertUsers.getAvailableStatus());
        return userDTO;
    }

    public static SkillsDTO convertSkillToSkillDTO(Skills convertSkill) {
        SkillsDTO skillsDTO = new SkillsDTO();
        skillsDTO.setId(convertSkill.getId());
        skillsDTO.setSkillName(convertSkill.getSkillName());
        skillsDTO.setSkillDescription(convertSkill.getSkillDescription());
        skillsDTO.setAvailableStatus(convertSkill.getAvailableStatus());
        return skillsDTO;
    }

    public static Skills convertSkillDTOToSkill(SkillsDTO skillsDTO) {
        Skills skill = new Skills();
        skill.setId(skillsDTO.getId()); // Nếu bạn có một ID, nếu không, có thể bỏ qua
        skill.setSkillName(skillsDTO.getSkillName());
        skill.setSkillDescription(skillsDTO.getSkillDescription());
        skill.setAvailableStatus(skillsDTO.getAvailableStatus());
        return skill;
    }

    public static TopicDTO convertTopicToTopicDTO(Topic convertTopic) {
        TopicDTO topicDTO = new TopicDTO();
        topicDTO.setId(convertTopic.getId());
        topicDTO.setTopicName(convertTopic.getTopicName());
        topicDTO.setDateCreated(convertTopic.getDateCreated());
        topicDTO.setContext(convertTopic.getContext());
        topicDTO.setProblems(convertTopic.getProblems());
        topicDTO.setActor(convertTopic.getActor());
        topicDTO.setNonFunctionRequirement(convertTopic.getNonFunctionRequirement());
        topicDTO.setRequirement(convertTopic.getRequirement());

        topicDTO.setSemesterDTO(convertSemesterToSemesterDTO(convertTopic.getSemester()));
        topicDTO.setMentorsDTO(convertMentorToMentorDTO(convertTopic.getMentor()));
        if(convertTopic.getSubMentors()!=null){
            topicDTO.setSubMentorDTO(convertMentorToMentorDTO(convertTopic.getSubMentors()));
        }


        topicDTO.setAvailableStatus(convertTopic.getAvailableStatus());
        return topicDTO;
    }

    public static GroupDTO convertGroupToGroupDTO(Group convertGroup) {
        GroupDTO groupDTO = new GroupDTO();
        StudentsDTO studentsDTO = new StudentsDTO();
        List<StudentsDTO> studentsListDTO = new ArrayList<>();
        groupDTO.setId(convertGroup.getId());
        groupDTO.setGroupName(convertGroup.getGroupName());
        groupDTO.setTotalPoint(convertGroup.getTotalPoint());
        groupDTO.setDateCreated(convertGroup.getDateCreated());

        for (Students student : convertGroup.getStudents()) {
            studentsDTO = new StudentsDTO();
            studentsDTO.setId(student.getId());
            studentsDTO.setStudentCode(student.getStudentCode());
            studentsDTO.setExpertise(student.getExpertise());
            studentsDTO.setDateUpdated(student.getDateUpdated());
            studentsDTO.setDateCreated(student.getDateCreated());
            studentsDTO.setPoint(student.getPoint());
            studentsDTO.setGroupRole(student.getGroupRole());
            if (student.getUser() != null) {
                studentsDTO.setUser(convertUserToUserDTO(student.getUser()));
            }
            studentsListDTO.add(studentsDTO);
        }

        if (convertGroup.getProject() != null) {
            groupDTO.setProject(convertProjectToProjectDTO(convertGroup.getProject()));
        }

        groupDTO.setStudents(studentsListDTO);
        groupDTO.setClassDTO(convertClassToClassDTO(convertGroup.getAClass()));

        groupDTO.setAvailableStatus(convertGroup.getAvailableStatus());
        return groupDTO;
    }

    public static MentorScheduleDTO convertMentorScheduleToMentorScheduleDTO(MentorSchedule mentorSchedule) {
        MentorScheduleDTO mentorScheduleDTO = new MentorScheduleDTO();

        mentorScheduleDTO.setId(mentorSchedule.getId());
        mentorScheduleDTO.setAvailableFrom(mentorSchedule.getAvailableFrom());
        mentorScheduleDTO.setAvailableTo(mentorSchedule.getAvailableTo());
        mentorScheduleDTO.setStatus(mentorSchedule.getStatus());
        mentorScheduleDTO.setAvailableStatus(mentorSchedule.getAvailableStatus());

        if (mentorSchedule.getMentor() != null) {
            Mentors mentor = new Mentors();
            mentor.setId(mentorSchedule.getMentor().getId());
            mentor.setMentorCode(mentorSchedule.getMentor().getMentorCode());
            mentor.setDateCreated(mentorSchedule.getMentor().getDateCreated());
            mentor.setStar(mentorSchedule.getMentor().getStar());
            mentor.setTotalTimeRemain(mentorSchedule.getMentor().getTotalTimeRemain());
            mentor.setAvailableStatus(mentorSchedule.getMentor().getAvailableStatus());
            mentorScheduleDTO.setMentor(convertMentorToMentorDTO(mentor));
        }

        return mentorScheduleDTO;
    }

    public static ProjectsDTO convertProjectToProjectDTO(Projects convertProject) {
        ProjectsDTO projectsDTO = new ProjectsDTO();

        projectsDTO.setId(convertProject.getId());
        projectsDTO.setDateCreated(convertProject.getDateCreated());
        projectsDTO.setDateUpdated(convertProject.getDateUpdated());
        projectsDTO.setDescription(convertProject.getDescription());
        projectsDTO.setProjectName(convertProject.getProjectName());
        projectsDTO.setPercentage(convertProject.getPercentage());
        projectsDTO.setAvailableStatus(convertProject.getAvailableStatus());
        if (convertProject.getProjectTasks() != null) {
            List<ProjectTasksDTO> projectTasksDTOList = new ArrayList<>();
            ProjectTasksDTO tasksDTO = new ProjectTasksDTO();
            for (ProjectTasks task : convertProject.getProjectTasks()) {
                tasksDTO.setId(task.getId());
                tasksDTO.setTaskName(task.getTaskName());
                tasksDTO.setStatus(task.getStatus());
                tasksDTO.setDescription(task.getDescription());
                tasksDTO.setAvailableStatus(task.getAvailableStatus());
                projectTasksDTOList.add(tasksDTO);
            }
            projectsDTO.setProjectTasks(projectTasksDTOList);
        }
        projectsDTO.setTopic(convertTopicToTopicDTO(convertProject.getTopic()));
        return projectsDTO;
    }

    public static BookingDTO convertBookingToBookingDTO(Booking convertBooking) {
        BookingDTO bookingDTO = new BookingDTO();

        bookingDTO.setId(convertBooking.getId());
        bookingDTO.setDateCreated(convertBooking.getDateCreated());
        bookingDTO.setDateUpdated(convertBooking.getDateUpdated());
        bookingDTO.setPointPay(convertBooking.getPointPay());
        bookingDTO.setGroup(convertGroupToGroupDTO(convertBooking.getGroup()));
        bookingDTO.setStatus(convertBooking.getStatus());
        bookingDTO.setMentorSchedule(convertMentorScheduleToMentorScheduleDTO(convertBooking.getMentorSchedule()));
        bookingDTO.setMentor(convertMentorToMentorDTO(convertBooking.getMentor()));
        bookingDTO.setAvailableStatus(convertBooking.getAvailableStatus());

        return bookingDTO;
    }

    public static NotificationsDTO convertNotificationToNotiDTO(Notifications notifications){
        NotificationsDTO notificationsDTO = new NotificationsDTO();
        notificationsDTO.setId(notifications.getId());
        notificationsDTO.setMessage(notifications.getMessage());  // Sửa lại chỗ này
        notificationsDTO.setDateTimeSent(notifications.getDateTimeSent());  // Sửa lại chỗ này
        notificationsDTO.setType(notifications.getType());
        notificationsDTO.setAction(notifications.getAction());

        // Kiểm tra và chuyển đổi sender
        if (notifications.getSender() != null) {
            UsersDTO senderDTO = convertUserToUserDTO(notifications.getSender());

            // Kiểm tra xem sender có phải là Student hoặc Mentor không
            if (notifications.getSender().getStudent() != null) {
                StudentsDTO studentDTO = convertStudentToStudentDTO(notifications.getSender().getStudent());
                senderDTO.setStudent(studentDTO);
            } else if (notifications.getSender().getMentor() != null) {
                MentorsDTO mentorDTO = convertMentorToMentorDTO(notifications.getSender().getMentor());
                senderDTO.setMentor(mentorDTO);
            }

            notificationsDTO.setSender(senderDTO);
        }

        // Kiểm tra và chuyển đổi receiver
        if (notifications.getReceiver() != null) {
            UsersDTO receiverDTO = convertUserToUserDTO(notifications.getReceiver());

            // Kiểm tra xem receiver có phải là Student hoặc Mentor không
            if (notifications.getReceiver().getStudent() != null) {
                StudentsDTO studentDTO = convertStudentToStudentDTO(notifications.getReceiver().getStudent());
                receiverDTO.setStudent(studentDTO);
            } else if (notifications.getReceiver().getMentor() != null) {
                MentorsDTO mentorDTO = convertMentorToMentorDTO(notifications.getReceiver().getMentor());
                receiverDTO.setMentor(mentorDTO);
            }

            notificationsDTO.setReciver(receiverDTO);
        }

        if(notifications.getBooking() != null){
            notificationsDTO.setBookingDTO(convertBookingToBookingDTO(notifications.getBooking()));
        }

        if(notifications.getGroup() != null){
            notificationsDTO.setGroupDTO(convertGroupToGroupDTO(notifications.getGroup()));
        }
        
        return notificationsDTO;
    }
    
    public static MeetingDTO convertMeetingToMeetingDTO(Meeting convertMeeting){
        MeetingDTO meetingDTO = new MeetingDTO();
        
        meetingDTO.setId(convertMeeting.getId());
        meetingDTO.setDateCreated(convertMeeting.getDateCreated());
        meetingDTO.setLinkURL(convertMeeting.getLinkURL());
        meetingDTO.setStatus(convertMeeting.getStatus());
        meetingDTO.setAvailableStatus(convertMeeting.getAvailableStatus());
        meetingDTO.setBooking(convertBookingToBookingDTO(convertMeeting.getBooking()));
        if (!convertMeeting.getReviews().isEmpty()){
            List<ReviewsDTO> reviewListDTO = convertMeeting.getReviews().stream()
                        .map(Converter::convertReviewToReviewDTO)
                        .collect(Collectors.toList());
            meetingDTO.setReviews(reviewListDTO);
        }
        
        return meetingDTO;
    }
    
    public static ReviewsDTO convertReviewToReviewDTO(Reviews review) {
        ReviewsDTO reviewsDTO = new ReviewsDTO();
        reviewsDTO.setId(review.getId());
        reviewsDTO.setComment(review.getComment());
        reviewsDTO.setRating(review.getRating());
        reviewsDTO.setDateCreated(review.getDateCreated());
        reviewsDTO.setAvailableStatus(review.getAvailableStatus());

        if (review.getUser() != null) {
            UsersDTO userDTO = Converter.convertUserToUserDTO(review.getUser());
            reviewsDTO.setUser(userDTO);
        }

        if (review.getUserReceive() != null) {
            UsersDTO userReceiveDTO = Converter.convertUserToUserDTO(review.getUserReceive());
            reviewsDTO.setUserReceive(userReceiveDTO);
        }

        return reviewsDTO;
    }
}
