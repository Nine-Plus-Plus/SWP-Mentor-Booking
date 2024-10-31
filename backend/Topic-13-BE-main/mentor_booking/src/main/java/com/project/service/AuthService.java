package com.project.service;

import com.project.dto.EmailRequest;
import com.project.dto.Response;
import com.project.dto.UsersDTO;
import com.project.enums.AvailableStatus;
import com.project.exception.OurException;
import com.project.model.Users;
import com.project.repository.UsersRepository;
import com.project.ultis.Converter;
import com.project.ultis.JWTUtils;
import com.project.ultis.Ultis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class AuthService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JWTUtils jWTUltis;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailServiceImpl emailService;

    /**
     * Phương thức thực hiện đăng nhập cho người dùng.
     *
     * @param loginRequest Đối tượng chứa thông tin đăng nhập (username và
     *                     password).
     * @return Đối tượng Response chứa thông tin về kết quả đăng nhập, bao gồm
     * mã trạng thái và token nếu đăng nhập thành công.
     */
    public Response login(Response loginRequest) {
        Response response = new Response();
        try {
            String username = loginRequest.getUsername().trim();
            String userNameDB = Objects.requireNonNull(usersRepository.findByUsernameLogin(username, AvailableStatus.ACTIVE).orElse(null)).getUsername().trim();

            if(!username.equals(userNameDB)){
                response.setStatusCode(400);
                response.setMessage("Incorrect Username or Password");
                return response;
            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            username,
                            loginRequest.getPassword()));
            var user = usersRepository.findByUsernameLogin(username, AvailableStatus.ACTIVE).orElse(null);
            if(user== null){
                response.setMessage("Incorrect Username or Password");
                response.setStatusCode(400);
                return response;
            }
            var jwt = jWTUltis.generateToken(user);

            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole().getRoleName());
            response.setExpirationTime("24 hours");
            response.setMessage("Successfully");

        } catch (OurException e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(400);
            response.setMessage("Incorrect Username or Password");
        }
        return response;
    }

    public Response changePassword(Response changeResponse) {
        Response response = new Response();
        try {
            // Tìm người dùng dựa trên username
            Users user = usersRepository.findByOtpCodeAndEmail(changeResponse.getOtpCode(), changeResponse.getEmail())
                    .orElseThrow(() -> new OurException("OTP not correct"));

            // Mã hóa và lưu mật khẩu mới
            user.setPassword(passwordEncoder.encode(changeResponse.getNewPassword()));
            user.setOtpCode(null);
            usersRepository.save(user);

            // Trả về phản hồi thành công
            response.setStatusCode(200);
            response.setMessage("Password changed successfully");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during password change: " + e.getMessage());
        }

        return response;
    }

    public Response changePasswordInUser(Response changeResponse) {
        Response response = new Response();
        try {
            // Tìm người dùng dựa trên username
            Users user = usersRepository.findByEmailAndAvailableStatus(changeResponse.getEmail(), AvailableStatus.ACTIVE)
                    .orElseThrow(() -> new OurException("Email not correct"));

            // Kiểm tra xem mật khẩu hiện tại có đúng không
            if (!passwordEncoder.matches(changeResponse.getPassword(), user.getPassword())) {
                throw new OurException("Current password is incorrect");
            }

            // Kiểm tra mật khẩu mới không được trùng với mật khẩu hiện tại
            if (passwordEncoder.matches(changeResponse.getNewPassword(), user.getPassword())) {
                throw new OurException("New password cannot be the same as the current password");
            }

            // Mã hóa và lưu mật khẩu mới
            user.setPassword(passwordEncoder.encode(changeResponse.getNewPassword()));
            user.setOtpCode(null);
            usersRepository.save(user);

            // Trả về phản hồi thành công
            response.setStatusCode(200);
            response.setMessage("Password changed successfully");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during password change: " + e.getMessage());
        }

        return response;
    }

    public Response processOAuthPostLogin(String email, String fullName) {
        Response response = new Response();
        try {
            var user = usersRepository.findByEmailAndAvailableStatus(email, AvailableStatus.ACTIVE)
                    .orElseThrow(() -> new OurException("User not found"));
            var jwt = jWTUltis.generateToken(user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole().getRoleName());
            response.setExpirationTime("24 hours");
            response.setMessage("Successfully");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during password change: " + e.getMessage());
        }

        return response;
    }

    public Response findByGmailChangePassword(Response responseEmail){
        Response response = new Response();
        try{
            Users users = usersRepository.findByEmailAndAvailableStatus(responseEmail.getEmail(), AvailableStatus.ACTIVE)
                    .orElseThrow(() -> new OurException("Email is not existed" + responseEmail.getEmail()));
            if(users != null){
                String otp = Ultis.generateOTP();
                users.setOtpCode(otp);
                usersRepository.save(users);

                // tạo mail
                EmailRequest emailRequest = new EmailRequest();
                emailRequest.setRecipient(users.getEmail());
                emailRequest.setMsgBody(otp);
                emailRequest.setSubject("OTP");
                emailService.sendOTP(emailRequest);

                response.setStatusCode(200);
                response.setMessage("OTP generated successfully");
            }else{
                response.setStatusCode(404);
            }
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during password change: " + e.getMessage());
        }
        return response;
    }

    public Response findByOTPChangePassword(Response responseEmail){
        Response response = new Response();
        try{
            Users users = usersRepository.findByOtpCodeAndEmail(responseEmail.getOtpCode(), responseEmail.getEmail())
                    .orElseThrow(() -> new OurException("OTP not correct"));
            if (users != null) {
                response.setStatusCode(200);
                response.setMessage("Successfully");
            }
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during password change: " + e.getMessage());
        }
        return response;
    }
}
