package com.ahmedesawy.flow.auth;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.flow.auth.dto.request.LoginRequest;
import com.ahmedesawy.flow.user.dto.response.AdminUserResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

   private final AuthService authService;

   public AuthController(AuthService authService) {
      this.authService = authService;
   }

   // Login
   @PostMapping("/login")
   public ResponseEntity<?> login(
      @RequestBody LoginRequest req,
      HttpServletRequest request,
      HttpServletResponse response 
   ) {
      return authService.login(req, request, response);
   }

   // Logout
   @PostMapping("/logout")
   public ResponseEntity<String> logout(
      HttpServletRequest request,
      HttpServletResponse response
   ) {
      return authService.logout(request, response);
   }

   // Session check
   @GetMapping("/me")
   public ResponseEntity<?> me(Authentication authentication) {
      System.out.println(authentication);

      try {
         AdminUserResponse user = authService.getAuthenticatedUser(authentication);
         boolean dashboardAccess = authService.dashboardAccess(authentication);
         return ResponseEntity.ok(
            Map.of(
               "user", user,
               "dashboardAccess", dashboardAccess
            )
         );
      } catch (Exception e) {
         return ResponseEntity.status(401).body(e.getMessage());
      }
   }

}