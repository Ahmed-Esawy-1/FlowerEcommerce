package com.ecommerce.dashboard.dto.request.user;

import jakarta.validation.constraints.Email;


public class UpdateProfileRequest {
  private String userName;
  
  @Email(message = "Invalid email format")
  private String email;


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

}
