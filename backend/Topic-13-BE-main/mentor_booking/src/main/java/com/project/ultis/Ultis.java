package com.project.ultis;

import java.security.SecureRandom;

public class Ultis {

    private static final int OTP_LENGTH = 5;
    private static final SecureRandom random = new SecureRandom();

    public static String generateOTP() {
        StringBuilder otp = new StringBuilder(OTP_LENGTH);
        for (int i = 0; i < OTP_LENGTH; i++) {
            // Tạo số ngẫu nhiên từ 0 đến 9
            int digit = random.nextInt(10);
            otp.append(digit);
        }
        return otp.toString();
    }

}
