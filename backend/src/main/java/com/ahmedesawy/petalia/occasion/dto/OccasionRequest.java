package com.ahmedesawy.petalia.occasion.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OccasionRequest {

    @NotBlank(message = "Occasion English Name is required") 
    private String nameEn;

    @NotBlank(message = "Occasion Arabic name is required") 
    private String nameAr;
    
    private MultipartFile image;
}
