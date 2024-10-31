package com.project.security;

import com.project.dto.Response;
import com.project.service.AuthService;
import com.project.service.UsersService;
import com.project.ultis.JWTUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JWTUtils jwtUtils;
    private final AuthService authService;

    public OAuth2LoginSuccessHandler(JWTUtils jwtUtils, AuthService authService) {
        this.jwtUtils = jwtUtils;
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();

        if (principal instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) principal;
            CustomOAuth2User customOAuth2User = new CustomOAuth2User(oidcUser);
            Response user = authService.processOAuthPostLogin(customOAuth2User.getEmail(), customOAuth2User.getName());
            response.sendRedirect("http://localhost:5173/public/login?token=" + user.getToken() + "&role=" + user.getRole());
        } else if (principal instanceof OAuth2User) {
            OAuth2User oAuth2User = (OAuth2User) principal;
            CustomOAuth2User customOAuth2User = new CustomOAuth2User(oAuth2User);
            Response user = authService.processOAuthPostLogin(customOAuth2User.getEmail(), customOAuth2User.getName());
            response.sendRedirect("http://localhost:5173/public/login?token=" + user.getToken() + "&role=" + user.getRole());
        }
    }
}
