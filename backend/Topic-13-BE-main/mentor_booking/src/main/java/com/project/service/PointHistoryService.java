package com.project.service;

import com.project.dto.GroupDTO;
import com.project.dto.PointHistoryDTO;
import com.project.dto.Response;
import com.project.model.PointHistory;
import com.project.model.Group;
import com.project.repository.PointHistoryRepository;
import com.project.repository.GroupRepository;
import com.project.repository.StudentsRepository;
import com.project.repository.BookingRepository;
import com.project.ultis.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PointHistoryService {
    @Autowired
    private PointHistoryRepository pointHistoryRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private StudentsRepository studentsRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Response getStudentPointHistory(Long studentId) {
        List<PointHistory> pointHistories = pointHistoryRepository.findByStudentIdOrderByDateCreatedDesc(studentId);
        List<PointHistoryDTO> pointHistoryDTOs = pointHistories.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        Response response = new Response();
        response.setStatusCode(200);
        response.setPointHistoryDTOList(pointHistoryDTOs);
        return response;
    }

    public Response getGroupPointHistory(Long groupId) {
        List<PointHistory> pointHistories = pointHistoryRepository.findByStudentGroupId(groupId);
        List<PointHistoryDTO> pointHistoryDTOs = pointHistories.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        Response response = new Response();
        response.setStatusCode(200);
        response.setPointHistoryDTOList(pointHistoryDTOs);
        return response;
    }

    public Response getAllGroupPoints() {
        List<Group> groups = groupRepository.findAll();
        List<GroupDTO> groupDTOs = groups.stream()
            .map(group -> {
                GroupDTO dto = new GroupDTO();
                dto.setId(group.getId());
                dto.setTotalPoint(group.getTotalPoint());
                return dto;
            })
            .collect(Collectors.toList());

        Response response = new Response();
        response.setStatusCode(200);
        response.setGroupDTOList(groupDTOs);
        return response;
    }

    public Long getTotalPointsByGroupId(Long groupId) {
        return pointHistoryRepository.findTotalPointsByGroupId(groupId);
    }

    private PointHistoryDTO convertToDTO(PointHistory pointHistory) {
        PointHistoryDTO dto = new PointHistoryDTO();
        dto.setId(pointHistory.getId());
        dto.setPoint(pointHistory.getPoint());
        dto.setStatus(pointHistory.getStatus());
        dto.setDateUpdated(pointHistory.getDateUpdated());
        dto.setDateCreated(pointHistory.getDateCreated());
        dto.setAvailableStatus(pointHistory.getAvailableStatus());

        if (pointHistory.getBooking() != null) {
            dto.setBooking(Converter.convertBookingToBookingDTO(pointHistory.getBooking()));
        }
        if (pointHistory.getStudent() != null) {
            dto.setStudentId(pointHistory.getStudent().getId());
        }

        return dto;
    }
}