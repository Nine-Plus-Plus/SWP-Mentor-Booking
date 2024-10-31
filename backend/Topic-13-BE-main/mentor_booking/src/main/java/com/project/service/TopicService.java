package com.project.service;

import com.project.dto.Response;
import com.project.dto.TopicDTO;
import com.project.enums.AvailableStatus;
import com.project.exception.OurException;
import com.project.model.Mentors;
import com.project.model.Semester;
import com.project.model.Topic;
import com.project.model.Class;
import com.project.repository.ClassRepository;
import com.project.repository.MentorsRepository;
import com.project.repository.SemesterRepository;
import com.project.repository.TopicRepository;
import com.project.ultis.Converter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.project.ultis.ExcelHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Thịnh Đạt
 */
@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private MentorsRepository mentorsRepository;

    @Autowired
    private SemesterRepository semesterRepository;

    @Autowired
    private ClassRepository classRepository;

    public Response createTopic(TopicDTO createRequest) {
        Response response = new Response();

        try {
            // Kiểm tra xem topic đã tồn tại chưa
            if (topicRepository.findByTopicName(createRequest.getTopicName()).isPresent()) {
                throw new OurException("Topic has already existed");
            }

            Mentors mentor = null;
            Mentors subMentor = null;
            Semester semester = null;

            // Lấy Mentor
            if (createRequest.getMentorsDTO() != null) {
                mentor = mentorsRepository.findById(createRequest.getMentorsDTO().getId())
                        .orElseThrow(() -> new OurException("Cannot find mentor id"));
            }

            // Lấy Sub-Mentor
            if (createRequest.getSubMentorDTO() != null && createRequest.getSubMentorDTO().getId() !=null) {
                subMentor = mentorsRepository.findById(createRequest.getSubMentorDTO().getId())
                        .orElseThrow(() -> new OurException("Cannot find sub-mentor id"));
            }

            // Kiểm tra Mentor và Sub-Mentor không được giống nhau
            if (mentor != null && subMentor != null && mentor.getId().equals(subMentor.getId())) {
                throw new OurException("Mentor and Sub-Mentor cannot be the same person");
            }

            // Lấy Semester
            if (createRequest.getSemesterDTO() != null) {
                semester = semesterRepository.findById(createRequest.getSemesterDTO().getId())
                        .orElseThrow(() -> new OurException("Cannot find semester id"));
            }

            // Tạo Topic
            Topic topic = new Topic();
            topic.setTopicName(createRequest.getTopicName().trim());
            topic.setContext(createRequest.getContext());
            topic.setProblems(createRequest.getProblems());
            topic.setActor(createRequest.getActor());
            topic.setRequirement(createRequest.getRequirement());
            topic.setNonFunctionRequirement(createRequest.getNonFunctionRequirement());
            topic.setDateCreated(LocalDateTime.now());
            topic.setDateUpdated(LocalDateTime.now());

            // Gán Mentor, Sub-Mentor, và Semester cho Topic
            topic.setMentor(mentor);
            topic.setSubMentors(subMentor);
            topic.setSemester(semester);
            topic.setAvailableStatus(AvailableStatus.ACTIVE);

            // Lưu Topic
            topicRepository.save(topic);

            // Tạo phản hồi
            if (topic.getId() != null && topic.getId() > 0) {
                TopicDTO dto = Converter.convertTopicToTopicDTO(topic);
                response.setTopicDTO(dto);
                response.setStatusCode(200);
                response.setMessage("Topic added successfully");
            }

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during topic creation: " + e.getMessage());
        }

        return response;
    }

    public Response getAllTopics() {
        Response response = new Response();
        try {
            List<Topic> topicLists = topicRepository.findByAvailableStatus(AvailableStatus.ACTIVE);
            List<TopicDTO> topicListDTO = null;
            if (topicLists != null) {
                topicListDTO = topicLists.stream()
                        .map(Converter::convertTopicToTopicDTO)
                        .collect(Collectors.toList());
                response.setTopicDTOList(topicListDTO);
                response.setStatusCode(200);
                response.setMessage("Topics fetched successfully");
            } else {
                response.setTopicDTOList(topicListDTO);
                throw new OurException("Cannot find any topic");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during get all topics " + e.getMessage());
        }
        return response;
    }

    public Response getTopicById(Long id) {
        Response response = new Response();
        try {
            Topic findTopic = topicRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            TopicDTO dto = Converter.convertTopicToTopicDTO(findTopic);
            response.setTopicDTO(dto);
            response.setStatusCode(200);
            response.setMessage("Successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during get topic " + e.getMessage());
        }
        return response;
    }

    public Response updateTopic(Long id, Topic newTopic) {
        Response response = new Response();
        try {
            Topic presentTopic = topicRepository.findById(id)
                    .orElseThrow(() -> new OurException("Cannot find topic with id: " + id));
            if (topicRepository.findByTopicName(newTopic.getTopicName()).isPresent()
                    && !newTopic.getTopicName().equals(presentTopic.getTopicName())) {
                throw new OurException("Topic has already existed");
            }
            if(newTopic.getTopicName()!=null) presentTopic.setTopicName(newTopic.getTopicName().trim());
            if(newTopic.getContext()!=null) presentTopic.setContext(newTopic.getContext());
            if(newTopic.getProblems()!=null) presentTopic.setProblems(newTopic.getProblems());
            if(newTopic.getActor()!=null) presentTopic.setActor(newTopic.getActor());
            if(newTopic.getRequirement()!=null) presentTopic.setRequirement(newTopic.getRequirement());
            if(newTopic.getNonFunctionRequirement()!=null) presentTopic.setNonFunctionRequirement(newTopic.getNonFunctionRequirement());
            presentTopic.setDateUpdated(LocalDateTime.now());
            if(newTopic.getMentor()!=null && newTopic.getMentor().getId()!=null) {
                Mentors mentor = mentorsRepository.findById(newTopic.getMentor().getId())
                        .orElseThrow(() -> new OurException("Cannot find mentor id"));
                if (presentTopic.getSubMentors() != null && presentTopic.getSubMentors().getId().equals(mentor.getId())) {
                    throw new OurException("Mentor and Sub-Mentor cannot be the same person");
                }

                presentTopic.setMentor(mentor);
            }
            if(newTopic.getSubMentors()!=null && newTopic.getSubMentors().getId()!= null) {
                Mentors subMentor = mentorsRepository.findById(newTopic.getSubMentors().getId())
                        .orElseThrow(() -> new OurException("Cannot find sub mentor id"));
                if (presentTopic.getMentor() != null && presentTopic.getMentor().getId().equals(subMentor.getId())) {
                    throw new OurException("Mentor and Sub-Mentor cannot be the same person");
                }

                presentTopic.setSubMentors(subMentor);
            } else {
            presentTopic.setSubMentors(null);
            }
            if (newTopic.getSemester() != null && newTopic.getSemester().getId() != null) {
                Semester semester = semesterRepository.findById(newTopic.getSemester().getId())
                        .orElseThrow(() -> new OurException("Cannot find semester id"));
                presentTopic.setSemester(semester);
            }
            topicRepository.save(presentTopic);

            TopicDTO dto = Converter.convertTopicToTopicDTO(presentTopic);
            response.setTopicDTO(dto);
            response.setStatusCode(200);
            response.setMessage("Topic updated successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while updating topic: " + e.getMessage());
        }
        return response;
    }

    public Response deleteTopic(Long id) {
        Response response = new Response();
        try {
            Topic deleteTopic = topicRepository.findById(id)
                    .orElseThrow(() -> new OurException("Cannot find topic with id: " + id));
            deleteTopic.setAvailableStatus(AvailableStatus.DELETED);
            topicRepository.save(deleteTopic);

            response.setStatusCode(200);
            response.setMessage("Topic deleted successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while deleting topic: " + id);
        }
        return response;
    }

    public Response getTopicBySemesterId(Long semesterId, String name) {
        Response response = new Response();
        try {
            List<Topic> topicList;
            if(name == null || name.isEmpty()){
                topicList = topicRepository.findTopicsBySemesterIdAndAvailableStatus(semesterId, AvailableStatus.ACTIVE);
            }else{
                topicList = topicRepository.findTopicsBySemesterIdAndTopicNameAvailableStatus(semesterId, name, AvailableStatus.ACTIVE);
            }

            if (topicList != null) {
                List<TopicDTO> topicListDTO = topicList.stream()
                        .map(Converter::convertTopicToTopicDTO)
                        .collect(Collectors.toList());
                response.setTopicDTOList(topicListDTO);
                response.setStatusCode(200);
                response.setMessage("Topic fetched successfully");
            } else {
                throw new OurException("Cannot find topics with semester ID: " + semesterId);
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during get all topics " + e.getMessage());
        }
        return response;
    }

    public Response getTopicByName(String topicName) {
        Response response = new Response();
        try {
            List<Topic> topicList = topicRepository.findByTopicNameContainingIgnoreCaseAndAvailableStatus(topicName, AvailableStatus.ACTIVE);
            if (topicList != null) {
                List<TopicDTO> topicListDTO = topicList.stream()
                        .map(Converter::convertTopicToTopicDTO)
                        .collect(Collectors.toList());
                response.setTopicDTOList(topicListDTO);
                response.setStatusCode(200);
                response.setMessage("Topic fetched successfully");
            } else {
                response.setTopicDTOList(new ArrayList<>());
                throw new OurException("Cannot find topics with the input: " + topicName);
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during get all topics " + e.getMessage());
        }
        return response;
    }

    public Response getUnchosenTopicsInClass(Long classId) {
        Response response = new Response();
        try {
            List<TopicDTO> topicListDTO = new ArrayList<>();
            if (classRepository.findByIdAndAvailableStatus(classId, AvailableStatus.ACTIVE) != null) {
                Class findClass = classRepository.findById(classId).orElse(null);
                List<Topic> topicList = topicRepository.findUnchosenTopicsInClass(classId, findClass.getSemester().getId());
                if (topicList != null) {
                    topicListDTO = topicList.stream()
                            .map(Converter::convertTopicToTopicDTO)
                            .collect(Collectors.toList());
                    response.setTopicDTOList(topicListDTO);
                    response.setStatusCode(200);
                    response.setMessage("Topics fetched successfully");
                }
            }else{
                throw new OurException("Cannot find class by id: "+classId);
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during get all topics " + e.getMessage());
        }
        return response;
    }

    public Response importTopicFromExcel(MultipartFile file) {
        Response response = new Response();
        List<String> errors = new ArrayList<>();

        try {
            List<TopicDTO> excelToTopics = ExcelHelper.excelToTopics(file);

            for (TopicDTO topicDTO : excelToTopics) {
                try {
                    Response createResponse = createTopicFromExcel(topicDTO);
                    if (createResponse.getStatusCode() != 200) {
                        errors.add("Error creating topic: " + topicDTO.getTopicName()
                                + " mentor: " + topicDTO.getMentorName()
                                + " submentor: " + topicDTO.getSubMentorName()
                                + " semestername: " + topicDTO.getSemesterName());
                    }
                } catch (OurException e) {
                    errors.add("Error creating topic: " + topicDTO.getTopicName() + " - " + e.getMessage());
                }
            }

            if (!errors.isEmpty()) {
                response.setStatusCode(400);
                response.setMessage("Import completed with errors: " + String.join(", ", errors));
            } else {
                response.setStatusCode(200);
                response.setMessage("All topics imported successfully.");
            }

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during import topics: " + e.getMessage());
        }

        return response;
    }

    public Response createTopicFromExcel(TopicDTO topicDTO){
        Response response = new Response();
        try{

            // Kiểm tra xem topic đã tồn tại chưa
            if (topicRepository.findByTopicName(topicDTO.getTopicName()).isPresent()) {
                throw new OurException("Topic has already existed");
            }

            Mentors mentor = null;
            Mentors subMentor = null;
            Semester semester = null;

            // Lấy Mentor
            if (topicDTO.getMentorName() != null) {
                mentor = mentorsRepository.findByNameForTopic(topicDTO.getMentorName(), AvailableStatus.ACTIVE)
                        .orElseThrow(() -> new OurException("Cannot find sub-mentor id"));
            }

            // Lấy Sub-Mentor
            if (topicDTO.getSubMentorName() != null) {
                subMentor = mentorsRepository.findByNameForTopic(topicDTO.getSubMentorName(), AvailableStatus.ACTIVE)
                        .orElseThrow(() -> new OurException("Cannot find sub-mentor id"));
            }

            // Kiểm tra Mentor và Sub-Mentor không được giống nhau
            if (mentor != null && subMentor != null && mentor.getId().equals(subMentor.getId())) {
                throw new OurException("Mentor and Sub-Mentor cannot be the same person");
            }

            // Lấy Semester
            if (topicDTO.getSemesterName() != null) {
                semester = semesterRepository.findBySemesterName(topicDTO.getSemesterName(), AvailableStatus.ACTIVE)
                        .orElseThrow(() -> new OurException("Cannot find semester id"));
            }

            // Tạo Topic
            Topic topic = new Topic();
            topic.setTopicName(topicDTO.getTopicName().trim());
            topic.setContext(topicDTO.getContext());
            topic.setProblems(topicDTO.getProblems());
            topic.setActor(topicDTO.getActor());
            topic.setRequirement(topicDTO.getRequirement());
            topic.setNonFunctionRequirement(topicDTO.getNonFunctionRequirement());
            topic.setDateCreated(LocalDateTime.now());
            topic.setDateUpdated(LocalDateTime.now());

            // Gán Mentor, Sub-Mentor, và Semester cho Topic
            topic.setMentor(mentor);
            topic.setSubMentors(subMentor);
            topic.setSemester(semester);
            topic.setAvailableStatus(AvailableStatus.ACTIVE);

            // Lưu Topic
            topicRepository.save(topic);

            // Tạo phản hồi
            if (topic.getId() != null && topic.getId() > 0) {
                TopicDTO dto = Converter.convertTopicToTopicDTO(topic);
                response.setTopicDTO(dto);
                response.setStatusCode(200);
                response.setMessage("Topic added successfully");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during topic creation: " + e.getMessage());
        }
        return response;
    }

}
