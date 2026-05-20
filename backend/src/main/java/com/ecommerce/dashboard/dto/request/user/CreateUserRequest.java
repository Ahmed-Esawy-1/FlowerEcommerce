package com.ecommerce.dashboard.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class CreateUserRequest {

  @NotBlank(message = "Name is required")
  private String userName;

  @NotBlank(message = "Email is required")
  @Email
  private String email;

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters")
  @Pattern(
    regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
    message = "Password must contain at least one letter and at least one digit"
  )
  private String password;

  @NotBlank(message = "Role is required")
  private String role;


  public String getUserName() {
    return userName;
  }
  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }
  public void setPassword(String password) {
    this.password = password;
  }

  public String getRole() {
    return role;
  }
  public void setRole(String role) {
    this.role = role;
  }

}