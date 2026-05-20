package com.ecommerce.dashboard.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.user.CreateUserRequest;
import com.ecommerce.dashboard.dto.request.user.UpdateUserRequest;
import com.ecommerce.dashboard.dto.request.user.UpdateUserRoleRequest;
import com.ecommerce.dashboard.dto.response.user.AdminUserResponse;
import com.ecommerce.dashboard.dto.response.user.UserResponse;
import com.ecommerce.dashboard.exception.BadRequestException;
import com.ecommerce.dashboard.mapper.AdminUserMapper;
import com.ecommerce.dashboard.mapper.UserMapper;
import com.ecommerce.dashboard.model.Role;
import com.ecommerce.dashboard.model.User;
import com.ecommerce.dashboard.repository.UserRepository;


@Service
public class AdminUserService {

   private final UserRepository userRepository;
   private final PasswordEncoder encoder;
   private final FileStorageService fileStorageService;


   public AdminUserService(
      UserRepository userRepository,
      PasswordEncoder encoder,
      FileStorageService fileStorageService
   ) {
      this.userRepository = userRepository;
      this.encoder = encoder;
      this.fileStorageService = fileStorageService;
   }

   // Get All Users
   public List<AdminUserResponse> getAllUsers() {
      return userRepository.findAll()
            .stream()
            .map(AdminUserMapper::toResponse)
            .toList();
   }

   // Get User By Id
   public AdminUserResponse getUserById(Long id) {
      User existing = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User Not Found"));

      return AdminUserMapper.toResponse(existing);
   }

   // Create User in dashboard
   public AdminUserResponse createUser(CreateUserRequest req, MultipartFile file, Authentication auth) {

      if (userRepository.existsByEmail(req.getEmail())) {
         throw new RuntimeException("Email exist already!");
      }

      String currentRole = auth.getAuthorities()
            .stream()
            .findFirst()
            .map(a -> a.getAuthority())
            .orElseThrow(() -> new RuntimeException("No role found"));

      Role requestedRole = Role.valueOf(req.getRole().toUpperCase());

      if (currentRole.equals("ROLE_USER")) {
         throw new BadRequestException("Not allowed to create users");
      }

      if (currentRole.equals("ROLE_ADMIN") && requestedRole != Role.USER) {
         throw new BadRequestException("Admin can only create USER accounts");
      }

      if (currentRole.equals("ROLE_OWNER") &&
         !(requestedRole == Role.ADMIN || requestedRole == Role.USER)) {

         throw new RuntimeException(
            "owner can only create ADMIN or USER"
         );
      }

      User user = new User();

      user.setUserName(req.getUserName());
      user.setEmail(req.getEmail());
      user.setPassword(encoder.encode(req.getPassword()));
      user.setRole(requestedRole);

      if (file != null && !file.isEmpty()) {
      user.setImageUrl(fileStorageService.uploadImage(file, "users"));
      }

      User saved = userRepository.save(user);
      return AdminUserMapper.toResponse(saved);
   }

   // Update User in dashboard
   public AdminUserResponse updateUser(Long id, UpdateUserRequest req, MultipartFile file) {
      User existing = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

      if (req.getEmail() != null && !req.getEmail().isBlank()) {

         if (!req.getEmail().equals(existing.getEmail()) &&
            userRepository.existsByEmail(existing.getEmail())) {

               throw new RuntimeException("Email already exists!");
         }

         existing.setEmail(req.getEmail());
      }

      if (req.getUserName() != null && !req.getUserName().isBlank()) {
      existing.setUserName(req.getUserName());
      }

      if (req.getPassword() != null && !req.getPassword().isBlank()) {
         existing.setPassword(encoder.encode(req.getPassword()));
      }

      if (file != null && !file.isEmpty()) {
      // delete old image
         if (existing.getImageUrl() != null) {
            try {
               fileStorageService.deleteFile("users/" + existing.getImageUrl());
            } catch (Exception e) {}
         }

         String imagePath = fileStorageService.uploadImage(file, "users");
         existing.setImageUrl(imagePath);
      }

      User saved = userRepository.save(existing);
      return AdminUserMapper.toResponse(saved);
   }

   // Update Role
   public UserResponse updateUserRole(Long id, UpdateUserRoleRequest request) {
      User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

      user.setRole(request.getRole());

      User saved = userRepository.save(user);
      return UserMapper.toResponse(saved);
   }

   // Delete User
   public void deleteUser(Long id) {
      User existing = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User Not Found"));

      if (existing.getImageUrl() != null) {
         try {
            fileStorageService.deleteFile("users/" + existing.getImageUrl());
         } catch (Exception e) {}
      }

      userRepository.delete(existing);
   }

}
