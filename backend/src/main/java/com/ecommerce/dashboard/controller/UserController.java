package com.ecommerce.dashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.LoginRequest;
import com.ecommerce.dashboard.model.Role;
import com.ecommerce.dashboard.model.User;
import com.ecommerce.dashboard.repository.UserRepository;
import com.ecommerce.dashboard.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {
  
  @Autowired
  UserRepository userRepo;

  @Autowired
  UserService userService;

  @Autowired
  private AuthenticationManager authenticationManager;


  @Value("${file.upload-dir}")
  private String uploadDir;

  // Get All User
  @GetMapping
  public List<User> getUsers() {
    return userRepo.findAll();
  }

  // Find User By id
  @GetMapping("/{id}")
  public User getUserById(@PathVariable Long id) {
      return userRepo.findById(id)
          .orElseThrow(() -> new RuntimeException("User not found"));
  }

  // Create New User
  @PostMapping(consumes = "multipart/form-data")
  public User registerUser(
    @RequestParam("name") String name,
    @RequestParam("email") String email,
    @RequestParam("password") String password,
    @RequestParam("role") String role,
    @RequestParam(value = "image", required = false) MultipartFile file
  ) {

    User user = new User();
    user.setName(name);
    user.setEmail(email);
    user.setPassword(password);
    user.setRole(Role.valueOf(role.toUpperCase()));

    return userService.register(user, file);
  }

  
  // Update User Info
  @PutMapping(value = "/{id}", consumes = "multipart/form-data")
  public User updateUser(
    @PathVariable Long id,
    @RequestParam("name") String name,
    @RequestParam("email") String email,
    @RequestParam(value = "password", required = false) String password,
    @RequestParam("role") String role,
    @RequestParam(value = "image", required = false) MultipartFile file
  ) {

    User user = new User();
    user.setName(name);
    user.setEmail(email);
    user.setPassword(password);
    user.setRole(Role.valueOf(role.toUpperCase()));

    return userService.updateUser(id, user, file);
  }

  // Delete User
  @DeleteMapping("/{id}")
  public void deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);;
  }
  

  // Login 
  @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest request) {

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

        return ResponseEntity.ok("LOGIN_SUCCESS");
      } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(403)
                .body(e.getMessage());
        }
   


    
    
    
  }

  // Check the Login Session
  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication authentication) {
    if(authentication == null || !authentication.isAuthenticated()) {
      return ResponseEntity.status(401).body("Unauthorized");
    }

    boolean allowed = authentication.getAuthorities()
        .stream()
        .anyMatch(auth ->
            auth.getAuthority().equals("ROLE_ADMIN") ||
            auth.getAuthority().equals("ROLE_MANAGER")
        );

    if (!allowed) {
      return ResponseEntity.status(403).body("Access denied");
  }

    return ResponseEntity.ok("AUTHENTICATED");
  }

  // Log Out
  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpServletRequest request) {
    request.getSession().invalidate();
    SecurityContextHolder.clearContext();

    return ResponseEntity.ok("LOGOUT_SUCCESS");

  }
  
  

}
