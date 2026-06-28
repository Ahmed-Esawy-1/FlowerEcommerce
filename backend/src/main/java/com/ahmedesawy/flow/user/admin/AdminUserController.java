package com.ahmedesawy.flow.user.admin;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ahmedesawy.flow.user.dto.request.CreateUserRequest;
import com.ahmedesawy.flow.user.dto.request.UpdateUserRequest;
import com.ahmedesawy.flow.user.dto.request.UpdateUserRoleRequest;
import com.ahmedesawy.flow.user.dto.response.AdminUserResponse;
import com.ahmedesawy.flow.user.dto.response.UserResponse;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

   public final AdminUserService adminUserService;

   public AdminUserController(AdminUserService adminUserService) {
      this.adminUserService = adminUserService;
   }


   // Get All User
   @GetMapping
   public List<AdminUserResponse> getUsers() {
      return adminUserService.getAllUsers();
   }

   // Find User By id
   @GetMapping("/{id}")
   public AdminUserResponse getUserById(@PathVariable Long id) {
      return adminUserService.getUserById(id);
   }

   // Create New User
   @PostMapping(consumes = "multipart/form-data")
   public AdminUserResponse createUser(
      @Valid @ModelAttribute CreateUserRequest request,
      @RequestParam(value = "image", required = false) MultipartFile file,
      Authentication authentication
   ) {
      return adminUserService.createUser(request, file, authentication);
   }



   // Update User Info
   @PutMapping(value = "/{id}", consumes = "multipart/form-data")
   public AdminUserResponse updateUser(
      @PathVariable Long id,
      @Valid @ModelAttribute UpdateUserRequest request, 
      @RequestParam(value = "image", required = false) MultipartFile file
   ) {
      return adminUserService.updateUser(id, request, file);
   }

   // Change user role (ADMIN ONLY)
   @PutMapping("/{id}/role")
   public UserResponse updateUserRole(
      @PathVariable Long id,
      @RequestBody UpdateUserRoleRequest request
   ) {
      return adminUserService.updateUserRole(id, request);
   }

  // Delete User
   @DeleteMapping("/{id}")
   public void deleteUser(@PathVariable Long id) {
      adminUserService.deleteUser(id);;
   }

}
