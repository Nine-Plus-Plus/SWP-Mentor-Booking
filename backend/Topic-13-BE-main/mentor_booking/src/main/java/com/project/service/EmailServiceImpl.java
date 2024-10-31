package com.project.service;

import com.project.dto.EmailRequest;
import com.project.dto.Response;
import com.project.exception.OurException;
import com.project.repository.GroupRepository;
import com.project.repository.UsersRepository;
import com.project.ultis.JWTUtils;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class EmailServiceImpl {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private JWTUtils jwtUtils;

    private AuthService authService;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private GroupService groupService;

    @Autowired
    private GroupRepository groupRepository;

    @Value("${spring.mail.username}")
    private String sender;

    public Response sendHtmlMail(EmailRequest emailRequest) {
        Response response = new Response();
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(sender);
            helper.setTo(emailRequest.getRecipient());
            helper.setSubject(emailRequest.getSubject());

            String htmlContent = "<div style='text-align: center; font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 5px;'>" +
                    "<h1 style='color: #FFBF00;'>Thông báo mới</h1>" +
                    "<p style='font-size: 16px; color: #333;'>" + emailRequest.getMsgBody() + "</p>" +
                    "<p style='font-size: 14px; color: #888;'>Mentor Booking</p>" +
                    "<footer style='margin-top: 30px; font-size: 12px; color: #aaa;'>" +
                    "<p>&copy; " + 2024 + " Booking Mentor System | SWP391-Group 99+.</p>" +
                    "</footer>" +
                    "</div>";

            helper.setText(htmlContent, true); // true để gửi dưới dạng HTML

            // Gửi email
            javaMailSender.send(mimeMessage);

            response.setStatusCode(200);
            response.setMessage("Gửi email tới: " + emailRequest.getRecipient() + " thành công");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (MessagingException e) {
            response.setStatusCode(500);
            response.setMessage("Đã xảy ra lỗi khi gửi email: " + e.getMessage());
        }
        return response;
    }

    public void sendOTP(EmailRequest emailRequest){
        Response response = new Response();
        try{
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(sender);
            helper.setTo(emailRequest.getRecipient());
            helper.setSubject(emailRequest.getSubject());

            String htmlContent = "<div style='text-align: center; font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 5px;'>" +
                    "<h1 style='color: #FFBF00;'>Mã OTP Của Bạn</h1>" +
                    "<p style='font-size: 16px; color: #333;'>" + emailRequest.getMsgBody() + "</p>" +
                    "<p style='font-size: 14px; color: #888;'>Mentor Booking</p>" +
                    "<footer style='margin-top: 30px; font-size: 12px; color: #aaa;'>" +
                    "<p>&copy; " + 2024 + " Booking Mentor System | SWP391-Group 99+.</p>" +
                    "</footer>" +
                    "</div>";

            helper.setText(htmlContent, true); // true để gửi dưới dạng HTML

            // Gửi email
            javaMailSender.send(mimeMessage);

            response.setStatusCode(200);
            response.setMessage("Gửi email tới: " + emailRequest.getRecipient() + " thành công");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (MessagingException e) {
            response.setStatusCode(500);
            response.setMessage("Đã xảy ra lỗi khi gửi email: " + e.getMessage());
        }
    }
}
