package com.ecommerce.dashboard.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.auth.ChangePasswordRequest;
import com.ecommerce.dashboard.dto.request.auth.RegisterRequest;
import com.ecommerce.dashboard.dto.request.user.UpdateProfileRequest;
import com.ecommerce.dashboard.dto.response.user.UserResponse;
import com.ecommerce.dashboard.exception.BadRequestException;
import com.ecommerce.dashboard.exception.NotFoundException;
import com.ecommerce.dashboard.exception.ResourceAlreadyExistsException;
import com.ecommerce.dashboard.mapper.UserMapper;
import com.ecommerce.dashboard.model.Role;
import com.ecommerce.dashboard.model.User;
import com.ecommerce.dashboard.repository.UserRepository;


@Service
public class UserService {

   private final UserRepository userRepository;
   private final PasswordEncoder encoder;
   private final FileStorageService fileStorageService;


   public UserService(
      UserRepository userRepository, 
      PasswordEncoder encoder, 
      FileStorageService fileStorageService
   ) {
      this.userRepository = userRepository;
      this.encoder = encoder;
      this.fileStorageService = fileStorageService;
   }

   // From Form SHop
   public UserResponse register(RegisterRequest req, MultipartFile file) {

      if (userRepository.findByEmail(req.getEmail()).isPresent()) {
         throw new ResourceAlreadyExistsException("Email already Exist!");
      }

      User user = new User();
      user.setUserName(req.getUserName());
      user.setEmail(req.getEmail());
      user.setPassword(encoder.encode(req.getPassword()));
      user.setRole(Role.USER);

      if (file != null && !file.isEmpty()) {
         user.setImageUrl(fileStorageService.uploadImage(file, "users"));
      }

      User saved = userRepository.save(user);
      return UserMapper.toResponse(saved);
   }

   // Update Your Profile
   public UserResponse updateCurrentUser(UpdateProfileRequest req, MultipartFile file, Authentication authentication) {

      String email = authentication.getName();

      User existing = userRepository.findByEmail(email)
            .orElseThrow(() -> new NotFoundException("We Cant't Found Your Account"));

      if (req.getEmail() != null && !req.getEmail().isBlank()) {

         if (!req.getEmail().equals(existing.getEmail())
            && userRepository.findByEmail(req.getEmail()).isPresent()) 
         {
            throw new ResourceAlreadyExistsException("Email already exists!");
         }

         existing.setEmail(req.getEmail());
      }


      if (req.getUserName() != null && !req.getUserName().isBlank()) {
         existing.setUserName(req.getUserName());
      }

      if (file != null && !file.isEmpty()) {

         if (existing.getImageUrl() != null) {
            fileStorageService.deleteFile(existing.getImageUrl());
         }

         String imagePath = fileStorageService.uploadImage(file, "users");
         existing.setImageUrl(imagePath);
      }

      User saved = userRepository.save(existing);
      return UserMapper.toResponse(saved);
   }

   // Change Your Password
   public void changePassword(ChangePasswordRequest req, Authentication authentication) {

      String email = authentication.getName();

      User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NotFoundException("We Cant't Found Your Account"));

      if (!encoder.matches(req.getOldPassword(), user.getPassword())) {
         throw new BadRequestException("Old password is incorrect");
      }

      if (req.getOldPassword().equals(req.getNewPassword())) {
         throw new BadRequestException("New password cannot be same as old password");
      }

      if(!req.getNewPassword().equals(req.getConfirmNewPassword())) {
         throw new BadRequestException("New password must be equal to confirm new password");
      }

      user.setPassword(encoder.encode(req.getNewPassword()));

      userRepository.save(user);
   }

}
