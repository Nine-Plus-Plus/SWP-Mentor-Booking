package com.project.service;

import com.project.dto.EmailRequest;
import com.project.dto.NotificationsDTO;
import com.project.dto.Response;
import com.project.enums.AvailableStatus;
import com.project.enums.NotificationAction;
import com.project.exception.OurException;
import com.project.model.Booking;
import com.project.model.Group;
import com.project.model.Notifications;
import com.project.model.Users;
import com.project.repository.BookingRepository;
import com.project.repository.GroupRepository;
import com.project.repository.NotificationRepository;
import com.project.repository.UsersRepository;
import com.project.ultis.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    UsersRepository usersRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    EmailServiceImpl emailService;

    public Response createNotification(NotificationsDTO notificationsDTO) {
        Response response = new Response();
        try {
            NotificationsDTO sendNotifications = new NotificationsDTO();

            // Kiểm tra sender
            Users sender = usersRepository.findByIdAndAvailableStatus(notificationsDTO.getSender().getId(), AvailableStatus.ACTIVE);
            if (sender == null) {
                response.setMessage("Sender not found");
                response.setStatusCode(400);
                response.setNotificationsDTO(sendNotifications);
                return response;
            }

            // Kiểm tra receiver
            Users reciver = usersRepository.findByIdAndAvailableStatus(notificationsDTO.getReciver().getId(), AvailableStatus.ACTIVE);
            if (reciver == null) {
                response.setMessage("Reciver not found");
                response.setStatusCode(400);
                response.setNotificationsDTO(sendNotifications);
                return response;
            }

            // Tạo notification
            Notifications notifications = new Notifications();
            notifications.setMessage(notificationsDTO.getMessage());
            notifications.setType(notificationsDTO.getType());
            notifications.setAvailableStatus(AvailableStatus.ACTIVE);
            notifications.setDateTimeSent(LocalDateTime.now());
            notifications.setSender(sender);
            notifications.setReceiver(reciver);

            // Kiểm tra GroupDTO và BookingDTO trước khi set
            if (notificationsDTO.getGroupDTO() != null) {
                Group group = groupRepository.findByIdAndAvailableStatus(notificationsDTO.getGroupDTO().getId(), AvailableStatus.ACTIVE);
                if (group != null) {
                    notifications.setGroup(group);
                }
            }

            if (notificationsDTO.getBookingDTO() != null) {
                Booking booking = bookingRepository.findByIdAndAvailableStatus(notificationsDTO.getBookingDTO().getId(), AvailableStatus.ACTIVE);
                if (booking != null) {
                    notifications.setBooking(booking);
                }
            }

            // tạo mail
            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setRecipient(reciver.getEmail());
            emailRequest.setMsgBody(notificationsDTO.getMessage());
            emailRequest.setSubject(String.valueOf(notificationsDTO.getType()));
            emailService.sendHtmlMail(emailRequest);

            // Lưu notification
            notificationRepository.save(notifications);

            // Chuyển đổi sang DTO và trả về response
            sendNotifications = Converter.convertNotificationToNotiDTO(notifications);
            response.setNotificationsDTO(sendNotifications);
            response.setStatusCode(200);
            response.setMessage("Send message to " + reciver.getUsername() + " successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred while creating notification: " + e.getMessage());
        }

        return response;
    }

    // Phương thức lấy tất cả notifications
    public Response getAllNotification() {
        Response response = new Response();
        try {
            List<NotificationsDTO> notificationsDTOList = new ArrayList<>();
            List<Notifications> notificationsList = notificationRepository.findAll();
            if(!notificationsList.isEmpty()){
                notificationsDTOList = notificationsList.stream()
                        .map(Converter::convertNotificationToNotiDTO)
                        .collect(Collectors.toList());

                response.setNotificationsDTOList(notificationsDTOList);
                response.setStatusCode(200);
                response.setMessage("Notifications fetched successfully");
            } else {
                response.setNotificationsDTOList(notificationsDTOList);
                response.setStatusCode(400);
                response.setMessage("Notifications not found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during get notification: " + e.getMessage());
        }
        return response;
    }

    // Phương thức lấy notifications bằng Id
    public Response getNotificationById(Long id){
        Response response = new Response();
        try {
            NotificationsDTO notificationsDTO = new NotificationsDTO();
            Notifications notifications = notificationRepository.findById(id)
                    .orElseThrow( () -> new OurException("nofications not found"));

            if(notifications!= null){
                notificationsDTO = Converter.convertNotificationToNotiDTO(notifications);
                response.setNotificationsDTO(notificationsDTO);
                response.setStatusCode(200);
                response.setMessage("Notifications fetched successfully");
            }else {
                response.setNotificationsDTO(notificationsDTO);
                response.setStatusCode(400);
                response.setMessage("Notifications not found");
            }

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during get notification by Id " + e.getMessage());
        }
        return response;
    }

    // Phương thức xóa notifications bằng Id
    public Response deleteNotification(Long id){
        Response response = new Response();
        try {

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during delete notification by Id " + e.getMessage());
        }
        return response;
    }

    // Phương thức chỉnh sửa notifications bằng Id
    public Response updateNotification(Long id, NotificationsDTO newNotification){
        Response response = new Response();
        try {
            Notifications updateNotification = notificationRepository.findById(id)
                    .orElseThrow(() -> new OurException("notifications not found"));

            updateNotification.setAction(newNotification.getAction());
            notificationRepository.save(updateNotification);

            response.setNotificationsDTO(Converter.convertNotificationToNotiDTO(updateNotification));
            response.setStatusCode(200);
            response.setMessage("Notifications updated successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during update notification by Id " + e.getMessage());
        }
        return response;
    }

    public Response getNotificationsByReciverId(Long id){
        Response response = new Response();
        try {
            List<NotificationsDTO> notificationsDTOList = new ArrayList<>();
            List<Notifications> notificationsList = notificationRepository.findByReceiverIdOrderByDateTimeSentDesc(id);
            if(!notificationsList.isEmpty()){
                notificationsDTOList = notificationsList.stream()
                        .map(Converter::convertNotificationToNotiDTO)
                        .collect(Collectors.toList());

                response.setNotificationsDTOList(notificationsDTOList);
                response.setStatusCode(200);
                response.setMessage("Notifications fetched successfully");
            } else {
                response.setNotificationsDTOList(notificationsDTOList);
                response.setStatusCode(400);
                response.setMessage("Notifications not found");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occured during get notification by Id " + e.getMessage());
        }
        return response;
    }
}
