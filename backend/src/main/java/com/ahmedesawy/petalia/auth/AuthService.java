package com.ahmedesawy.petalia.auth;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ahmedesawy.petalia.auth.dto.request.LoginRequest;
import com.ahmedesawy.petalia.auth.dto.request.SignupRequest;
import com.ahmedesawy.petalia.auth.dto.response.LoginResponse;
import com.ahmedesawy.petalia.auth.signupVerify.SignupVerificationService;
import com.ahmedesawy.petalia.common.exception.NotFoundException;
import com.ahmedesawy.petalia.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.petalia.common.exception.UnauthorizedException;
import com.ahmedesawy.petalia.role.Permission;
import com.ahmedesawy.petalia.user.AuthProvider;
import com.ahmedesawy.petalia.user.UserMapper;
import com.ahmedesawy.petalia.user.UserResponse;
import com.ahmedesawy.petalia.user.customer.Customer;
import com.ahmedesawy.petalia.user.customer.CustomerRepository;
import com.ahmedesawy.petalia.user.employee.Employee;
import com.ahmedesawy.petalia.user.employee.EmployeeRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;

    private final PasswordEncoder encoder;

    private final TokenBlacklistService tokenBlacklistService;
    private final SignupVerificationService signupVerificationService;
    private final RefreshTokenService refreshTokenService;

    // ---- Durations
    // -------------------------------------------------------------------------
    private static final Duration CUSTOMER_SESSION = Duration.ofHours(24);
    private static final Duration CUSTOMER_REMEMBER_ME = Duration.ofDays(365);
    private static final Duration EMPLOYEE_SESSION = Duration.ofHours(1);
    private static final Duration EMPLOYEE_REMEMBER_ME = Duration.ofDays(30);

    // ---- SIGN UP
    // --------------------------------------------------------------------------------
    public void signup(SignupRequest req) {

        if (employeeRepository.existsByEmail(req.getEmail()) || customerRepository.existsByEmail(req.getEmail()))
            throw new ResourceAlreadyExistsException("Email already exist!");

        Customer user = new Customer();
        user.setUserName(req.getUserName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setProvider(AuthProvider.LOCAL);

        customerRepository.save(user);

        signupVerificationService.sendVerificationCode(user.getEmail(), AccountIdentity.AccountType.CUSTOMER);

    }

    // ---- LOGIN -----------------------------
    public LoginResponse login(LoginRequest req) {

        Customer customerCheck = customerRepository.findByEmail(req.getEmail()).orElse(null);
        if (customerCheck != null && customerCheck.getProvider() != AuthProvider.LOCAL) {
            throw new BadCredentialsException("This account uses Google sign-in. Please continue with Google.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()));

        if (!authentication.isAuthenticated())
            throw new BadCredentialsException("Login failed");

        Object principal = authentication.getPrincipal();
        Map<String, Object> claims = new HashMap<>();

        UUID accountId;
        AccountIdentity.AccountType accountType;
        Duration sessionDuration;
        Duration rememberMeDuration;

        if (principal instanceof EmployeePrincipal employeePrincipal) {
            if (!employeePrincipal.isEmailVerified()) {
                throw new DisabledException("Please verify your email before logging in");
            }

            accountId = employeePrincipal.getId();
            accountType = AccountIdentity.AccountType.EMPLOYEE;
            sessionDuration = EMPLOYEE_SESSION;
            rememberMeDuration = EMPLOYEE_REMEMBER_ME;

            claims.put("id", employeePrincipal.getId());
            claims.put("role", employeePrincipal.getRoleName());

        } else if (principal instanceof CustomerPrincipal customerPrincipal) {

            if (!customerPrincipal.isEmailVerified()) {
                throw new DisabledException("Please verify your email before logging in");
            }

            accountId = customerPrincipal.getId();
            accountType = AccountIdentity.AccountType.CUSTOMER;
            sessionDuration = CUSTOMER_SESSION;
            rememberMeDuration = CUSTOMER_REMEMBER_ME;

            claims.put("id", customerPrincipal.getId());
        } else {
            throw new IllegalStateException("Unknown principal type: " + principal.getClass());
        }

        Duration effectiveDuration = req.isRememberMe() ? rememberMeDuration : sessionDuration;

        String accessToken = jwtService.generateToken(req.getEmail(), claims, effectiveDuration.toMillis());
        String refreshToken = req.isRememberMe()
                ? refreshTokenService.create(accountId, accountType)
                : null;

        return new LoginResponse(accessToken, refreshToken);

    }

    // ---- REFRESH ------------------
    public LoginResponse refreshAccessToken(String refreshTokenValue) {
        RefreshTokenService.RefreshTokenData data = refreshTokenService.validate(refreshTokenValue);

        Map<String, Object> claims = new HashMap<>();
        String email;
        Duration sessionDuration;

        switch (data.type()) {
            case CUSTOMER -> {
                Customer customer = customerRepository.findByIdOrThrow(data.accountId());
                email = customer.getEmail();
                claims.put("id", customer.getId());
                sessionDuration = CUSTOMER_SESSION;
            }
            case EMPLOYEE -> {
                Employee employee = employeeRepository.findByIdOrThrow(data.accountId());
                email = employee.getEmail();
                claims.put("id", employee.getId());
                claims.put("role", employee.getRole().getCode());
                sessionDuration = EMPLOYEE_SESSION;
            }
            default -> throw new IllegalStateException("Unknown account type");
        }

        refreshTokenService.revoke(refreshTokenValue);
        String newRefreshToken = refreshTokenService.create(data.accountId(), data.type());
        String newAccessToken = jwtService.generateToken(email, claims, sessionDuration.toMillis());

        return new LoginResponse(newAccessToken, newRefreshToken);
    }

    // ---- ME ----------------------------------------------------
    public UserResponse getAuthenticatedUser(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Unauthorized");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof EmployeePrincipal employeePrincipal) {
            Employee employee = employeeRepository.findByEmail(employeePrincipal.getEmail())
                    .orElseThrow(() -> new NotFoundException("Employee not found"));
            return UserMapper.toEmployeeResponse(employee);

        } else if (principal instanceof CustomerPrincipal customerPrincipal) {
            Customer customer = customerRepository.findByEmail(customerPrincipal.getEmail())
                    .orElseThrow(() -> new NotFoundException("Customer not found"));
            return UserResponse.builder()
                    .id(customer.getId())
                    .userName(customer.getUserName())
                    .email(customer.getEmail())
                    .imageUrl(customer.getImageUrl())
                    .build();
        } else {
            throw new IllegalStateException("Unknown principal type: " + principal.getClass());
        }
    }

    public boolean dashboardAccess(Authentication authentication) {
        if (authentication == null)
            return false;

        return authentication.getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals(Permission.VIEW_DASHBOARD.getPermission()));
    }

    // ---- UPDATE PROFILE
    // --------------------------------------------------------------------------------------

    // public UserResponse update(
    // UpdateProfileRequest req,
    // MultipartFile file,
    // Authentication authentication
    // ) {

    // String email = authentication.getName();
    // Employee existing = findUserByEmail(email);

    // if (req.getEmail() != null && !req.getEmail().isBlank()) {

    // if (!req.getEmail().equals(existing.getEmail())
    // && employeeRepository.existsByEmail(req.getEmail()))
    // {
    // throw new ResourceAlreadyExistsException("Email already exists!");
    // }

    // existing.setEmail(req.getEmail());
    // }

    // if (req.getUserName() != null && !req.getUserName().isBlank()) {
    // existing.setUserName(req.getUserName());
    // }

    // if (file != null && !file.isEmpty()) {

    // if (existing.getImageUrl() != null) {
    // fileStorageService.deleteFile(existing.getImageUrl());
    // }

    // String imagePath = fileStorageService.uploadImage(file, "users");
    // existing.setImageUrl(imagePath);
    // }

    // return EmployeeMapper.toResponse(employeeRepository.save(existing));
    // }

    // ---- LOG OUT
    // --------------------------------------------------------------------------------------
    public String logout(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BadCredentialsException("No token provided");
        }

        String token = authHeader.substring(7);
        long remainingMillis = jwtService.getRemainingExpiryMillis(token);
        tokenBlacklistService.blacklist(token, remainingMillis);

        return "LOGOUT_SUCCESS";
    }

}
