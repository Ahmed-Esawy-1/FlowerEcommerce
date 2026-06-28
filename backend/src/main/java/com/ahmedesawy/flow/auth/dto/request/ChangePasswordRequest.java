package com.ahmedesawy.flow.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class ChangePasswordRequest {

  @NotBlank
  private String oldPassword;

  @NotBlank
  @Size(min = 8)
  @Pattern(
      regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
      message = "Password must be at least 8 characters contain at least one Letter and one digit"
  )
  private String newPassword;
  @NotBlank
  private String confirmNewPassword;

  public String getOldPassword() {
    return oldPassword;
  }
  public void setOldPassword(String oldPassword) {
    this.oldPassword = oldPassword;
  }

  public String getNewPassword() {
    return newPassword;
  }
  public void setNewPassword(String newPassword) {
    this.newPassword = newPassword;
  }

  public void setConfirmNewPassword(String confirmNewPassword) {
    this.confirmNewPassword = confirmNewPassword;
  }
  public String getConfirmNewPassword() {
    return confirmNewPassword;
  }
  
}
