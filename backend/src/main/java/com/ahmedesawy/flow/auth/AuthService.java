package com.ahmedesawy.flow.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ahmedesawy.flow.auth.dto.request.LoginRequest;
import com.ahmedesawy.flow.common.exception.NotFoundException;
import com.ahmedesawy.flow.user.User;
import com.ahmedesawy.flow.user.UserRepository;
import com.ahmedesawy.flow.user.admin.AdminUserMapper;
import com.ahmedesawy.flow.user.dto.response.AdminUserResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {

   private final AuthenticationManager authenticationManager;
   private final UserRepository userRepository;
   private final RoleAwareRememberMeServices rememberMeServices;

   public AuthService(
      AuthenticationManager authenticationManager,
      UserRepository userRepository,
      RoleAwareRememberMeServices rememberMeServices
   ) {
      this.authenticationManager = authenticationManager;
      this.userRepository = userRepository;
      this.rememberMeServices = rememberMeServices;
   }


   // Login
   public ResponseEntity<?> login(
      LoginRequest req,
      HttpServletRequest request,
      HttpServletResponse response
   ) {
      try {
         Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
               req.getEmail().trim(),
               req.getPassword()
            )
         );

         SecurityContextHolder.getContext().setAuthentication(authentication);

         request.getSession(true)
               .setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext()); 
      
         if (req.isRememberMe()) {
            rememberMeServices.loginSuccess(request, response, authentication);
         }

         User user = userRepository.findByEmail(authentication.getName())
               .orElseThrow(() -> new NotFoundException("Account isn't exist."));
         
         return ResponseEntity.ok(AdminUserMapper.toResponse(user));

      } catch (Exception e) {
      
         return ResponseEntity.status(403)
               .body(e.getClass().getName() + " : " + e.getMessage());
      }

   }

   // Log Out
   public ResponseEntity<String> logout(
      HttpServletRequest request,
      HttpServletResponse response
   ) {
      rememberMeServices.loginFail(request, response);
      request.getSession().invalidate();
      SecurityContextHolder.clearContext();
      return ResponseEntity.ok("LOGOUT_SUCCESS");
   }

   // Get authenticated user session
   public AdminUserResponse getAuthenticatedUser(Authentication authentication) {
      if(authentication == null || !authentication.isAuthenticated()) {
         throw new RuntimeException("Unauthorized");
      }

      User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new NotFoundException("User not found"));

      return AdminUserMapper.toResponse(user);
   }

   // Check Dashboard Access ( User not allowed ) 
   public boolean dashboardAccess(Authentication authentication) {
      return authentication.getAuthorities()
            .stream()
            .anyMatch(auth ->
               auth.getAuthority().equals("ROLE_ADMIN") ||
               auth.getAuthority().equals("ROLE_OWNER")
            );
   }


}
