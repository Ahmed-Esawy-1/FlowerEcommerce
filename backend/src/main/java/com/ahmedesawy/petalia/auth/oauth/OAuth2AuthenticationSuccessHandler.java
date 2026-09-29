package com.ahmedesawy.petalia.auth.oauth;

import java.io.IOException;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.ahmedesawy.petalia.auth.AccountIdentity;
import com.ahmedesawy.petalia.auth.JwtService;
import com.ahmedesawy.petalia.auth.RefreshTokenService;
import com.ahmedesawy.petalia.user.AuthProvider;
import com.ahmedesawy.petalia.user.customer.Customer;
import com.ahmedesawy.petalia.user.customer.CustomerRepository;
import com.ahmedesawy.petalia.user.employee.EmployeeRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final OAuthExchangeService oAuthExchangeService;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Customer customer = customerRepository.findByEmail(email)
                .map(existing -> {
                    if (existing.getProvider() == AuthProvider.LOCAL) {
                        throw new IllegalStateException(
                                "An account with this email already exists. Please log in with your password.");
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    if (employeeRepository.findByEmail(email).isPresent()) {
                        throw new IllegalStateException(
                                "This email is registered as an employee account. Please log in through the dashboard.");
                    }
                    return customerRepository.save(
                            Customer.builder()
                                    .email(email)
                                    .userName(name)
                                    .emailVerified(true)
                                    .password(null)
                                    .provider(AuthProvider.GOOGLE)
                                    .build());
                });

        String accessToken = jwtService.generateToken(customer.getEmail());
        String refreshToken = refreshTokenService.create(customer.getId(), AccountIdentity.AccountType.CUSTOMER);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofDays(365))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        String code = oAuthExchangeService.store(accessToken);
        response.sendRedirect(frontendBaseUrl + "/oauth/callback?code=" + code);

    }

}
