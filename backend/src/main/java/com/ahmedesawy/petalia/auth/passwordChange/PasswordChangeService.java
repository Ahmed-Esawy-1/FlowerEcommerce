package com.ahmedesawy.petalia.auth.passwordChange;

import java.time.Duration;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ahmedesawy.petalia.auth.AccountIdentity;
import com.ahmedesawy.petalia.auth.AuthService;
import com.ahmedesawy.petalia.auth.PrincipalResolver;
import com.ahmedesawy.petalia.common.util.CodeGenerator;
import com.ahmedesawy.petalia.user.customer.Customer;
import com.ahmedesawy.petalia.user.customer.CustomerRepository;
import com.ahmedesawy.petalia.user.employee.Employee;
import com.ahmedesawy.petalia.user.employee.EmployeeRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class PasswordChangeService {
    
    private final PrincipalResolver principalResolver;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final JavaMailSender mailSender;
    private final AuthService authService;

    private static final Duration CODE_TTL = Duration.ofMinutes(2);

    public void requestPasswordChange(ChangePasswordRequest request, Authentication authentication) {
        AccountIdentity identity = principalResolver.resolve(authentication);

        String currentHash = switch (identity.type()) {
            case CUSTOMER -> customerRepository.findByIdOrThrow(identity.id()).getPassword();
            case EMPLOYEE -> employeeRepository.findByIdOrThrow(identity.id()).getPassword();
        };

        if(!passwordEncoder.matches(request.getOldPassword(), currentHash)) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        String code =  CodeGenerator.generate(6);
        PendingPasswordChange pending = new PendingPasswordChange(
            identity.id(),
            identity.type(),
            passwordEncoder.encode(request.getNewPassword())
        );

        try {
            redisTemplate.opsForValue().set(
                redisKey(identity),
                objectMapper.writeValueAsString(pending),
                CODE_TTL
            );
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize pending password change", e);
        }

        redisTemplate.opsForValue().set(
            codeKey(identity),
            code,
            CODE_TTL
        );

        sendVerificationEmail(identity.email(), code);

    }

    public void confirmPasswordChange(String code, Authentication authentication, HttpServletRequest request) {

        AccountIdentity identity = principalResolver.resolve(authentication);

        String storedCode = redisTemplate.opsForValue().get(codeKey(identity));
        if(storedCode == null || !code.equals(storedCode)) {
            throw new BadCredentialsException("Invalid or expired verification code");
        }

        String pendingJson = redisTemplate.opsForValue().get(redisKey(identity));
        if(pendingJson == null) {
            throw new IllegalStateException("No pending password change found");
        }

        PendingPasswordChange pending;
        try {
            pending = objectMapper.readValue(pendingJson, PendingPasswordChange.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to parse pending password change", e);
        }

        switch (identity.type()) {
            case CUSTOMER -> {
                Customer customer = customerRepository.findByIdOrThrow(identity.id(), "Customer");
                customer.setPassword(pending.newPasswordHash());
                customerRepository.save(customer);
            }
            case EMPLOYEE -> {
                Employee employee = employeeRepository.findByIdOrThrow(identity.id(), "Employee");
                employee.setPassword(pending.newPasswordHash());
                employeeRepository.save(employee);
            }
        }

        redisTemplate.delete(codeKey(identity));
        redisTemplate.delete(redisKey(identity));


        authService.logout(request);
    }



    // ---- HELPERS ---------------------------------------------------------------------
    private String redisKey(AccountIdentity identity) {
        return "password-change:pending:%s:%s".formatted(identity.type(), identity.id());
    }

    private String codeKey(AccountIdentity identity) {
        return "password-change:code:%s:%s".formatted(identity.type(), identity.id());
    }

    private void sendVerificationEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Confirm your password change");
        message.setText("Your verification code is: " + code + "\nIt expires in 2 minutes.");
        mailSender.send(message);
    }

    private record PendingPasswordChange(UUID accountId, AccountIdentity.AccountType type, String newPasswordHash) {}
}
