package com.ahmedesawy.petalia.auth.signupVerify;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Getter 
@Setter 
public class VerifySignupRequest {
    @NotBlank 
    private String email;

    @NotBlank 
    private String code;

}
