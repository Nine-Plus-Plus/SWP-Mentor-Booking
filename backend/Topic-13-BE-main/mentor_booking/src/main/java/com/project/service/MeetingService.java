package com.project.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.ConferenceData;
import com.google.api.services.calendar.model.ConferenceSolutionKey;
import com.google.api.services.calendar.model.CreateConferenceRequest;
import com.project.dto.MeetingDTO;
import com.project.dto.Response;
import com.project.enums.AvailableStatus;
import com.project.enums.BookingStatus;
import com.project.enums.MeetingStatus;
import com.project.exception.OurException;
import com.project.model.Booking;
import com.project.model.Meeting;
import com.project.repository.BookingRepository;
import com.project.repository.MeetingRepository;
import com.project.ultis.Converter;
import com.project.ultis.GoogleOAuthUtil;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class MeetingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private MeetingRepository meetingRepository;

    private String createGoogleMeetEvent(Long bookingId) {
        String meetUrl = "";
        try {
            Calendar service = new Calendar.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(), GsonFactory.getDefaultInstance(), GoogleOAuthUtil.getCredentials())
                    .setApplicationName("Mentor Booking")
                    .build();

            ZoneId gmtPlus7 = ZoneId.of("GMT+7");
            
            Booking booking = bookingRepository.findByIdAndAvailableStatus(bookingId, AvailableStatus.ACTIVE);
            LocalDateTime startDateTime = booking.getMentorSchedule().getAvailableFrom();
            LocalDateTime endDateTime = booking.getMentorSchedule().getAvailableTo();

            // Attach the GMT+7 time zone to the LocalDateTime
            ZonedDateTime startZonedDateTime = startDateTime.atZone(gmtPlus7);
            ZonedDateTime endZonedDateTime = endDateTime.atZone(gmtPlus7);

            // Convert to Google API DateTime
            DateTime gStartDateTime = new DateTime(startZonedDateTime.toInstant().toEpochMilli());
            DateTime gEndDateTime = new DateTime(endZonedDateTime.toInstant().toEpochMilli());

            // Define the event details
            Event event = new Event()
                    .setSummary("Google Meet Event")
                    .setDescription("Event with Google Meet link")
                    .setStart(new EventDateTime().setDateTime(gStartDateTime).setTimeZone("GMT+7"))
                    .setEnd(new EventDateTime().setDateTime(gEndDateTime).setTimeZone("GMT+7"));

            // Add Google Meet conference details
            ConferenceSolutionKey conferenceSolutionKey = new ConferenceSolutionKey().setType("hangoutsMeet");
            CreateConferenceRequest createConferenceRequest = new CreateConferenceRequest().setRequestId("12345");
            ConferenceData conferenceData = new ConferenceData()
                    .setCreateRequest(createConferenceRequest.setConferenceSolutionKey(conferenceSolutionKey));

            event.setConferenceData(conferenceData);

            // Insert event
            Event createdEvent = service.events().insert("primary", event)
                    .setConferenceDataVersion(1)
                    .execute();
            meetUrl = createdEvent.getConferenceData().getEntryPoints().get(0).getUri();
        } catch (Exception e) {
            throw new OurException("Error while create Meet URL: "+ e.getMessage());
        }
        return meetUrl;
    }
    
    public Response createMeeting(Long bookingId){
        Response response = new Response();
        try{
            Booking booking = bookingRepository.findByIdAndAvailableStatusAndStatus(bookingId, AvailableStatus.ACTIVE, BookingStatus.CONFIRMED);
            if (booking == null) throw new OurException("Cannot find booking");
            
            Meeting meeting = new Meeting();
            meeting.setAvailableStatus(AvailableStatus.ACTIVE);
            meeting.setBooking(booking);
            meeting.setDateCreated(LocalDateTime.now());
            meeting.setLinkURL(createGoogleMeetEvent(bookingId));
            meeting.setStatus(MeetingStatus.SCHEDULED);
            meeting.setReviews(new ArrayList<>());
            
            meetingRepository.save(meeting);
            
            if (meeting.getId() > 0) {
                MeetingDTO dto = Converter.convertMeetingToMeetingDTO(meeting);
                response.setMeetingDTO(dto);
                response.setStatusCode(200);
                response.setMessage("Create meeting successfully");
            }
            
        }catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during meeting creation: " + e.getMessage());
        }
        return response;
    }
    
    public Response getMeetingByBookingId(Long bookingId){
        Response response = new Response();
        try {
            Meeting meeting = meetingRepository.findByBookingIdAndAvailableStatus(bookingId, AvailableStatus.ACTIVE);
            MeetingDTO dto = new MeetingDTO();
            if (meeting != null) {
                dto = Converter.convertMeetingToMeetingDTO(meeting);
                response.setMeetingDTO(dto);
                response.setStatusCode(200);
                response.setMessage("Meeting fetched successfully");
            } else {
                response.setMeetingDTO(dto);
                response.setStatusCode(400);
                response.setMessage("Cannot find any meeting");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during get meeting by booking ID: " + e.getMessage());
        }
        return response;
    }
    
    public Response getMeetingsByUserId(Long userId){
        Response response = new Response();
        try {
            List<Meeting> meetingList = meetingRepository.findMeetingsByUserId(userId);
            List<MeetingDTO> meetingListDTO = new ArrayList<>();
            if (!meetingList.isEmpty()) {
                meetingListDTO = meetingList.stream()
                        .map(Converter::convertMeetingToMeetingDTO)
                        .collect(Collectors.toList());

                response.setMeetingDTOList(meetingListDTO);
                response.setStatusCode(200);
                response.setMessage("Meetings fetched successfully");
            } else {
                response.setMeetingDTOList(meetingListDTO);
                response.setStatusCode(400);
                response.setMessage("Cannot find any meeting");
            }
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during get meetings by user ID: " + e.getMessage());
        }
        return response;
    }
    
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void setMeetingStatusAutomatically() {
        try {
            List<Meeting> meetingList = meetingRepository.findAllByStatusAndAvailableToBefore(MeetingStatus.SCHEDULED, LocalDateTime.now());

            if (!meetingList.isEmpty()) {
                for (Meeting meeting : meetingList) {
                    meeting.setStatus(MeetingStatus.COMPLETED);
                    meetingRepository.save(meeting);
                }
            }

        } catch (Exception e) {
            System.out.println("Error while setting meeting status automatically: " + e.getMessage());
        }
    }
}
