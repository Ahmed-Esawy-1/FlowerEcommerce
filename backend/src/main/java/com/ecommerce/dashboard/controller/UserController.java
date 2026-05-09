package com.ecommerce.dashboard.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.LoginRequest;
import com.ecommerce.dashboard.dto.request.RegisterRequest;
import com.ecommerce.dashboard.dto.response.UserResponse;
import com.ecommerce.dashboard.model.Role;
import com.ecommerce.dashboard.model.User;
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
  
  public final UserService userService;
  
  public UserController(UserService userService) {
    this.userService = userService;
  }


  // Get All User
  @GetMapping
  public List<UserResponse> getUsers() {
    return userService.getAllUsers();
  }

  // Find User By id
  @GetMapping("/{id}")
  public UserResponse getUserById(@PathVariable Long id) {
      return userService.getUserById(id);
  }

  // Create New User
  @PostMapping(consumes = "multipart/form-data")
  public User registerUser(
    @RequestParam("name") String name,
    @RequestParam("email") String email,
    @RequestParam("password") String password,
    @RequestParam("role") String role,
    @RequestParam(value = "image", required = false) MultipartFile file,
    Authentication authentication
  ) {

    User user = new User();
    user.setName(name);
    user.setEmail(email);
    user.setPassword(password);
    user.setRole(Role.valueOf(role.toUpperCase()));

    return userService.register(user, file, authentication);
  }

  @PostMapping("/shop/register")
  public User shopRegister(
    @RequestParam("name") String name,
    @RequestParam("email") String email,
    @RequestParam("password") String password,
    @RequestParam(value = "image", required = false) MultipartFile file
  ) {

    RegisterRequest req = new RegisterRequest();
    req.setName(name);
    req.setEmail(email);
    req.setPassword(password);

    return userService.registerFromShop(req, file);
  }
  
  // Update User Info
  @PutMapping(value = "/{id}", consumes = "multipart/form-data")
  public User updateUser(
    @PathVariable Long id,
    @RequestParam("name") String name,
    @RequestParam("email") String email,
    @RequestParam(value = "password", required = false) String password,
    @RequestParam(value = "image", required = false) MultipartFile file
  ) {

    User user = new User();
    user.setName(name);
    user.setEmail(email);
    user.setPassword(password);

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
    return userService.login(req, request);
  }

  // Check the Login Session
  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication authentication) {
    try {
        UserResponse user = userService.getAuthenticatedUser(authentication);

        boolean dashboardAccess = userService.isDashboardUser(authentication);

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
  

  // Log Out
  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpServletRequest request) {
    return userService.logout(request);
  }
  
  

}
