package com.ahmedesawy.petalia.auth.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {
    private String userName;
  
  @Email(message = "Invalid email format")
  private String email;

}
