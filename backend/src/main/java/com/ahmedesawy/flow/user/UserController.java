package com.ahmedesawy.flow.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ahmedesawy.flow.auth.dto.request.ChangePasswordRequest;
import com.ahmedesawy.flow.auth.dto.request.RegisterRequest;
import com.ahmedesawy.flow.user.dto.request.UpdateProfileRequest;
import com.ahmedesawy.flow.user.dto.response.UserResponse;



@RestController
@RequestMapping("/users")
public class UserController {


   private final UserService userService;
   private final PasswordEncoder encoder;

   public UserController(UserService userService, PasswordEncoder encoder) {
      this.userService = userService;
      this.encoder = encoder;
   }

   // Register in Shop Form
   @PostMapping("/register")
   public UserResponse shopRegister(
      @ModelAttribute RegisterRequest request,
      @RequestParam(value = "image", required = false) MultipartFile file
   ) {
      return userService.register(request, file);
   }


   @PutMapping(value = "/updateProfile")
   public UserResponse updateCurrentUser(
      @ModelAttribute UpdateProfileRequest request,
      @RequestParam(value = "image", required = false) MultipartFile file,
      Authentication authentication
   ) {
      return userService.updateCurrentUser(request, file, authentication);
   }

   // Change password (logged-in user)
   @PutMapping("/change-password")
   public ResponseEntity<String> changePassword(
      @RequestBody ChangePasswordRequest request,
      Authentication authentication
   ) {
      userService.changePassword(request, authentication);
      return ResponseEntity.ok("Password changed successfully");
   }

}
