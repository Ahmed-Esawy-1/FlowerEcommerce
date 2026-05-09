package com.ecommerce.dashboard.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.LoginRequest;
import com.ecommerce.dashboard.dto.request.RegisterRequest;
import com.ecommerce.dashboard.dto.response.UserResponse;
import com.ecommerce.dashboard.mapper.UserMapper;
import com.ecommerce.dashboard.model.Role;
import com.ecommerce.dashboard.model.User;
import com.ecommerce.dashboard.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder encoder;
  private final AuthenticationManager authenticationManager;

  @Value("${file.upload-dir}")
  private String uploadDir;

  public UserService(UserRepository userRepository, PasswordEncoder encoder, AuthenticationManager authenticationManager) {
    this.userRepository = userRepository;
    this.encoder = encoder;
    this.authenticationManager = authenticationManager;
  }

  // Get All Users
  public List<UserResponse> getAllUsers() {
    return userRepository.findAll()
      .stream()
      .map(UserMapper::mapToDto)
      .toList();
  }

  // Get User By Id
  public UserResponse getUserById(Long id) {
    User existing = userRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("User Not Found"));

    return UserMapper.mapToDto(existing);
  }

  // Register New User
  public User register(User user, MultipartFile file, Authentication auth) {
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
      throw new RuntimeException("Email already in use");
  }

    String currentRole = auth.getAuthorities()
      .stream()
      .findFirst()
      .map(a -> a.getAuthority())
      .orElseThrow(() -> new RuntimeException("No role found"));

    Role requestedRole = user.getRole();

    
    if (currentRole.equals("ROLE_USER")) {
        throw new RuntimeException("Not allowed to create users");
    }

    if (currentRole.equals("ROLE_ADMIN")) {
        if (requestedRole != Role.USER) {
          throw new RuntimeException("Admin can only create USER accounts");
        }
    }

    if (currentRole.equals("ROLE_MANAGER")) {
        if (requestedRole != Role.ADMIN && requestedRole != Role.USER) {
            throw new RuntimeException("Manager can only create ADMIN or USER");
        }
    }

    user.setPassword(encoder.encode(user.getPassword()));
    user.setRole(requestedRole);

    if (file != null && !file.isEmpty()) {
        user.setImageUrl(uploadImage(file));
    }

    return userRepository.save(user);
}

  // Register New User from Form SHop
  public User registerFromShop(RegisterRequest req, MultipartFile file) {

    User user = new User();

    user.setName(req.getName());
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
      throw new RuntimeException("Email already in use");
  }
    user.setEmail(req.getEmail());
    user.setPassword(encoder.encode(req.getPassword()));
    user.setRole(Role.USER);

    if (file != null && !file.isEmpty()) {
        user.setImageUrl(uploadImage(file));
    }

    return userRepository.save(user);
  }


  // Update User
  public User updateUser(Long id,User user, MultipartFile file) {
    User existing = userRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("User not found"));

    existing.setName(user.getName());
    existing.setEmail(user.getEmail());

    if (user.getPassword() != null && !user.getPassword().isBlank()) {
      existing.setPassword(encoder.encode(user.getPassword()));
    }

    if (file != null && !file.isEmpty()) {
      // delete old image
      if (existing.getImageUrl() != null) {
        try {
          Path oldPath = Paths.get(uploadDir, existing.getImageUrl());
          Files.deleteIfExists(oldPath);
        } catch (Exception e) {}
      }

      String imagePath = uploadImage(file);
      existing.setImageUrl(imagePath);
    }

    return userRepository.save(existing);
  }

  // Delete User
  public void deleteUser(Long id) {
    User existing = userRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("User Not Found"));

    if (existing.getImageUrl() != null) {
      try {
          Path oldPath = Paths.get(uploadDir, existing.getImageUrl());
          Files.deleteIfExists(oldPath);
      } catch (Exception e) {}
    }

    userRepository.deleteById(id);
  }


  // Authenticate user login
  public ResponseEntity<?> login(LoginRequest req, HttpServletRequest request) {
    try {
      Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
          req.getEmail().trim(),
          req.getPassword().trim()
        )
      );

      SecurityContextHolder.getContext().setAuthentication(authentication);

      request.getSession(true)
        .setAttribute("SPRING_SECURITY_CONTEXT",
          SecurityContextHolder.getContext());

      User user = userRepository
        .findByEmail(authentication.getName())
        .orElseThrow();
      
      return ResponseEntity.ok(UserMapper.mapToDto(user));
    } catch (Exception e) {
      return ResponseEntity.status(403)
        .body(e.getMessage());
    }

  }

  // Get authenticated user session
  public UserResponse getAuthenticatedUser(Authentication authentication) {
    if(authentication == null || !authentication.isAuthenticated()) {
      throw new RuntimeException("Unauthorized");
    }

    User user = userRepository
      .findByEmail(authentication.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));

      return UserMapper.mapToDto(user);
  }

  // Check Dashboard Loginned 
  public boolean isDashboardUser(Authentication authentication) {
    return authentication.getAuthorities()
      .stream()
      .anyMatch(auth ->
        auth.getAuthority().equals("ROLE_ADMIN") ||
        auth.getAuthority().equals("ROLE_MANAGER")
      );
  }

  // Log Out
  public ResponseEntity<String> logout(HttpServletRequest request) {
    request.getSession().invalidate();
    SecurityContextHolder.clearContext();
    return ResponseEntity.ok("LOGOUT_SUCCESS");
  }

  


  // Upload Image
  public String uploadImage(MultipartFile file) {
    try {
      
      String folder = uploadDir + "/users";
      Path uploadPath = Paths.get(folder);
      if(!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(),  uploadPath.resolve(fileName));

        return "users/" +  fileName;
    } catch(Exception e) {
      throw new RuntimeException(e);
    }
  }

}
