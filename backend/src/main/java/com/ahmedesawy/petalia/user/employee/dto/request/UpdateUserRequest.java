package com.ahmedesawy.petalia.user.employee.dto.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
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

   private MultipartFile image;
}
