package com.ahmedesawy.petalia.auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.petalia.auth.dto.request.LoginRequest;
import com.ahmedesawy.petalia.auth.dto.request.RefreshTokenRequest;
import com.ahmedesawy.petalia.auth.dto.request.SignupRequest;
import com.ahmedesawy.petalia.auth.dto.response.LoginResponse;
import com.ahmedesawy.petalia.auth.signupVerify.ResendVerificationRequest;
import com.ahmedesawy.petalia.auth.signupVerify.SignupVerificationService;
import com.ahmedesawy.petalia.auth.signupVerify.VerifySignupRequest;
import com.ahmedesawy.petalia.user.UserResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated 
public class AuthController {

    private final AuthService authService;
    private final SignupVerificationService signupVerificationService;


    // ---- SIGN UP -----------------------------------------------------------------
    @PostMapping("/signup")
    public ResponseEntity<Void> shopSignup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/signup/verify")
    public ResponseEntity<String> verifySignup(@Valid @RequestBody VerifySignupRequest request) {
        signupVerificationService.verify(request);
        return ResponseEntity.ok("Email verified successfully");
    }

    @PostMapping("/signup/resend")
    public ResponseEntity<String> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        signupVerificationService.resend(request.getEmail());
        return ResponseEntity.ok("Verification code resent");
    }


    // ---- LOGIN -------------------------------------------------------------------------------------------
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refreshAccessToken(request.getRefreshToken());
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(Authentication authentication) {
        UserResponse user = authService.getAuthenticatedUser(authentication);
        boolean dashboardAccess = authService.dashboardAccess(authentication);
        return ResponseEntity.ok(Map.of(
            "user", user,
            "dashboardAccess", dashboardAccess
        ));
    }


   // @PutMapping(value = "/updateProfile")
   // public UserResponse updateCurrentUser(
   //     @ModelAttribute UpdateProfileRequest request,
   //     @RequestParam(value = "image", required = false) MultipartFile file,
   //     Authentication authentication
   //  ) {
   //     return auth.update(request, file, authentication);
   //  }



    // ---- LOG OUT --------------------------------------------------------------------------------------
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        return ResponseEntity.ok(authService.logout(request));
    }


}