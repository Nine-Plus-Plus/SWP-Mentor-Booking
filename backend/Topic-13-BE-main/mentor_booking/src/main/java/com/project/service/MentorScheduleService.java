package com.project.service;

import com.project.dto.MentorScheduleDTO;
import com.project.dto.MentorsDTO;
import com.project.dto.Response;
import com.project.enums.AvailableStatus;
import com.project.enums.MentorScheduleStatus;
import com.project.exception.OurException;
import com.project.model.MentorSchedule;
import com.project.model.Mentors;
import com.project.repository.MentorScheduleRepository;
import com.project.repository.MentorsRepository;
import com.project.ultis.Converter;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MentorScheduleService {

    @Autowired
    MentorScheduleRepository mentorScheduleRepository;

    @Autowired
    MentorsRepository mentorsRepository;

    public Response createMentorSchedule(MentorScheduleDTO inputRequest){
        Response response = new Response();
        try {
            Mentors mentor = mentorsRepository.findByIdAndAvailableStatus(inputRequest.getMentor().getId(), AvailableStatus.ACTIVE);

            if (inputRequest.getMentor() == null || inputRequest.getMentor().getId() == null) {
                response.setStatusCode(400);
                response.setMessage("Mentor ID is required");
                return response;
            }

            if (inputRequest.getAvailableFrom() == null || inputRequest.getAvailableTo() == null) {
                response.setStatusCode(400);
                response.setMessage("AvailableFrom and AvailableTo must be provided");
                return response;
            }

            // Kiểm tra availableFrom phải trong tương lai
            if (inputRequest.getAvailableFrom().isBefore(LocalDateTime.now())) {
                response.setStatusCode(400);
                response.setMessage("Available from time must be in the future");
                return response;
            }

            // Kiểm tra availableFrom phải nhỏ hơn availableTo
            if (inputRequest.getAvailableFrom().isAfter(inputRequest.getAvailableTo())) {
                response.setStatusCode(400);
                response.setMessage("Available from time must be before available to time");
                return response;
            }

            // Kiểm tra lịch hẹn không bị trùng
            boolean isScheduleConflict = mentorScheduleRepository.existsByMentorAndAvailableStatusAndAvailableFromLessThanEqualAndAvailableToGreaterThanEqual(
                    mentor,
                    AvailableStatus.ACTIVE,
                    inputRequest.getAvailableTo(),
                    inputRequest.getAvailableFrom()
            );

            if (isScheduleConflict) {
                response.setStatusCode(400);
                response.setMessage("Schedule conflicts with existing mentor availability");
                return response;
            }

            LocalDateTime timeStart = inputRequest.getAvailableFrom();
            LocalDateTime timeEnd = inputRequest.getAvailableTo();
            float time = (float) timeStart.until(timeEnd, ChronoUnit.HOURS);

            if (mentor.getTotalTimeRemain() < time) {
                throw new OurException("You have reached your support time limit for this semester");
            }

            // Tạo mới MentorSchedule từ input
            MentorSchedule mentorSchedule = new MentorSchedule();
            mentorSchedule.setAvailableFrom(inputRequest.getAvailableFrom());
            mentorSchedule.setAvailableTo(inputRequest.getAvailableTo());
            mentorSchedule.setStatus(inputRequest.getStatus());
            mentorSchedule.setAvailableStatus(AvailableStatus.ACTIVE);
            mentorSchedule.setStatus(MentorScheduleStatus.AVAILABLE);
            mentorSchedule.setMentor(mentor);
            mentorScheduleRepository.save(mentorSchedule);

            response.setMentorScheduleDTO(Converter.convertMentorScheduleToMentorScheduleDTO(mentorSchedule));
            response.setStatusCode(200);
            response.setMessage("Mentor schedule created successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while create mentor schedule: " + e.getMessage());
        }

        return response;
    }

    public Response getAllMentorSchedule(){
        Response response = new Response();
        try{
            List<MentorScheduleDTO> mentorScheduleDTOList = new ArrayList<>();
            List<MentorSchedule> mentorScheduleList = mentorScheduleRepository.findByAvailableStatus(AvailableStatus.ACTIVE);

            if(!mentorScheduleList.isEmpty()){
                mentorScheduleDTOList = mentorScheduleList.stream()
                        .map(Converter::convertMentorScheduleToMentorScheduleDTO)
                        .collect(Collectors.toList());

                response.setMentorScheduleDTOList(mentorScheduleDTOList);
                response.setStatusCode(200);
                response.setMessage("Mentor Schedule fetched successfully");
            }else{
                response.setMentorScheduleDTOList(mentorScheduleDTOList);
                response.setStatusCode(400);
                response.setMessage("No data found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while get all mentor schedule: " + e.getMessage());
        }
        return response;
    }

    public Response getMentorScheduleById(Long id){
        Response response = new Response();
        try{
            MentorScheduleDTO mentorScheduleDTO = new MentorScheduleDTO();
            MentorSchedule mentorSchedule = mentorScheduleRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            if(mentorSchedule != null){
                mentorScheduleDTO = Converter.convertMentorScheduleToMentorScheduleDTO(mentorSchedule);
                response.setMentorScheduleDTO(mentorScheduleDTO);
                response.setStatusCode(200);
                response.setMessage("Mentor Schedule fetched successfully");
            }else{
                response.setMentorScheduleDTO(mentorScheduleDTO);
                response.setStatusCode(400);
                response.setMessage("No data found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while get all mentor schedule: " + e.getMessage());
        }
        return response;
    }

    public Response deleteMentorSchedule(Long id){
        Response response = new Response();
        try {
            MentorSchedule mentorSchedule = mentorScheduleRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            if(mentorSchedule != null){
                mentorSchedule.setAvailableStatus(AvailableStatus.DELETED);
                mentorScheduleRepository.save(mentorSchedule);
                response.setStatusCode(200);
                response.setMessage("Mentor Schedule deleted successfully");
            }else{
                response.setStatusCode(400);
                response.setMessage("No data found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while delete mentor schedule: " + e.getMessage());
        }
        return response;
    }

    public Response updateMentorSchedule(Long id, MentorScheduleDTO updateRequest){
        Response response = new Response();
        try{
            MentorScheduleDTO mentorScheduleDTO = new MentorScheduleDTO();
            MentorSchedule mentorSchedule = mentorScheduleRepository.findByIdAndAvailableStatus(id, AvailableStatus.ACTIVE);
            // Kiểm tra nếu không tìm thấy MentorSchedule
            if (mentorSchedule == null) {
                response.setStatusCode(400);
                response.setMessage("Mentor schedule not found");
                return response;
            }

            // Kiểm tra availableFrom phải trong tương lai
            if (updateRequest.getAvailableFrom().isBefore(LocalDateTime.now())) {
                response.setStatusCode(400);
                response.setMessage("Available from time must be in the future");
                return response;
            }

            // Kiểm tra availableFrom phải nhỏ hơn availableTo
            if (updateRequest.getAvailableFrom().isEqual(updateRequest.getAvailableTo()) || updateRequest.getAvailableFrom().isAfter(updateRequest.getAvailableTo())) {
                response.setStatusCode(400);
                response.setMessage("Available from time must be before available to time");
                return response;
            }

            // Kiểm tra không có lịch trình nào trùng với thời gian mới
            boolean isScheduleConflict = mentorScheduleRepository.existsByMentorAndAvailableStatusAndAvailableFromLessThanEqualAndAvailableToGreaterThanEqualAndIdNot(
                    mentorSchedule.getMentor(),
                    AvailableStatus.ACTIVE,
                    updateRequest.getAvailableTo(),
                    updateRequest.getAvailableFrom(),
                    mentorSchedule.getId()  // Bỏ qua chính lịch trình hiện tại
            );

            if (isScheduleConflict) {
                response.setStatusCode(400);
                response.setMessage("Schedule conflicts with an existing schedule.");
                return response;
            }

            // Cập nhật các trường dữ liệu
            mentorSchedule.setAvailableFrom(updateRequest.getAvailableFrom());
            mentorSchedule.setAvailableTo(updateRequest.getAvailableTo());
            mentorScheduleRepository.save(mentorSchedule);

            mentorScheduleDTO = Converter.convertMentorScheduleToMentorScheduleDTO(mentorSchedule);
            response.setMentorScheduleDTO(mentorScheduleDTO);
            response.setStatusCode(200);
            response.setMessage("Mentor schedule updated successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while update mentor schedule: " + e.getMessage());
        }
        return response;
    }

    public Response getAllMentorScheduleByMentor(Long mentorId){
        Response response = new Response();
        try{
            List<MentorScheduleDTO> mentorScheduleDTOList = new ArrayList<>();
            List<MentorSchedule> mentorScheduleList = mentorScheduleRepository.findByMentorIdAndAvailableStatusAndStatus(mentorId, AvailableStatus.ACTIVE, MentorScheduleStatus.AVAILABLE);
            if(!mentorScheduleList.isEmpty()){
                mentorScheduleDTOList = mentorScheduleList.stream()
                        .map(Converter::convertMentorScheduleToMentorScheduleDTO)
                        .collect(Collectors.toList());

                response.setMentorScheduleDTOList(mentorScheduleDTOList);
                response.setStatusCode(200);
                response.setMessage("Mentor Schedule fetched successfully");
            }else{
                response.setMentorScheduleDTOList(mentorScheduleDTOList);
                response.setStatusCode(400);
                response.setMessage("No data found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetch mentor schedule: " + e.getMessage());
        }
        return response;
    }

    public Response getAllMentorScheduleByMentorForMentor(Long mentorId){
        Response response = new Response();
        try{
            List<MentorScheduleDTO> mentorScheduleDTOList = new ArrayList<>();
            List<MentorSchedule> mentorScheduleList = mentorScheduleRepository.findByMentorIdAndAvailableStatusForMentor(mentorId, AvailableStatus.ACTIVE);
            if(!mentorScheduleList.isEmpty()){
                mentorScheduleDTOList = mentorScheduleList.stream()
                        .map(Converter::convertMentorScheduleToMentorScheduleDTO)
                        .collect(Collectors.toList());

                response.setMentorScheduleDTOList(mentorScheduleDTOList);
                response.setStatusCode(200);
                response.setMessage("Mentor Schedule fetched successfully");
            }else{
                response.setMentorScheduleDTOList(mentorScheduleDTOList);
                response.setStatusCode(400);
                response.setMessage("No data found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while get all mentor schedule: " + e.getMessage());
        }
        return response;
    }

    public List<MentorScheduleDTO> findAllMentorScheduleByMentor(Long mentorId){
        List<MentorScheduleDTO> mentorScheduleDTOList = new ArrayList<>();
        List<MentorSchedule> mentorScheduleList = mentorScheduleRepository.findByMentorIdAndAvailableStatusAndStatus(mentorId, AvailableStatus.ACTIVE, MentorScheduleStatus.AVAILABLE);
        if(!mentorScheduleList.isEmpty()){
            mentorScheduleDTOList = mentorScheduleList.stream()
                    .map(Converter::convertMentorScheduleToMentorScheduleDTO)
                    .collect(Collectors.toList());
        }
        if (mentorScheduleList.isEmpty()) {
            return new ArrayList<>(); // Trả về danh sách trống thay vì null
        }
        return mentorScheduleDTOList;
    }

    public Response expireMentorSchedule(Long scheduleId){
        Response response = new Response();
        try{
            MentorScheduleDTO mentorScheduleDTO = new MentorScheduleDTO();
            MentorSchedule mentorSchedule = mentorScheduleRepository.findByIdAndAvailableStatus(scheduleId, AvailableStatus.ACTIVE);
            if(mentorSchedule !=null){
                mentorSchedule.setStatus(MentorScheduleStatus.EXPIRED);
                mentorScheduleRepository.save(mentorSchedule);

                mentorScheduleDTO = Converter.convertMentorScheduleToMentorScheduleDTO(mentorSchedule);
                response.setMentorScheduleDTO(mentorScheduleDTO);
                response.setStatusCode(200);
                response.setMessage("Mentor schedule updated successfully");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while fetch mentor schedule: " + e.getMessage());
        }
        return response;
    }

    // Phương thức sẽ chạy định kỳ
    @Scheduled(fixedRate = 60000)  // Chạy mỗi 60 giây (1 phút)
    @Transactional
    public void expireMentorSchedulesAutomatically() {
        try {
            List<MentorSchedule> expiredSchedules = mentorScheduleRepository.findByAvailableToBeforeAndStatus(LocalDateTime.now(), MentorScheduleStatus.AVAILABLE);

            for (MentorSchedule schedule : expiredSchedules) {
                schedule.setStatus(MentorScheduleStatus.EXPIRED);
                mentorScheduleRepository.save(schedule);
            }
            System.out.println("Expired schedules updated successfully.");
        } catch (Exception e) {
            System.err.println("Error while expiring mentor schedules: " + e.getMessage());
        }
    }
}
