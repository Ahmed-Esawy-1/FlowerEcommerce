package com.ahmedesawy.flow.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateUserRequest {

  private String userName;

  @Email(message = "Invalid email format")
  private String email;

  @Size(min = 8)
  @Pattern(
    regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
    message = "Password must contain letters and digits"
  )
  private String password;


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

}
