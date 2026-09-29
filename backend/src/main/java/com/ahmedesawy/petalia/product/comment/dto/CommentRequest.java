package com.ahmedesawy.petalia.product.comment.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class CommentRequest {
    @NotBlank(message = "Your comment cann't be empty.")
    private String content;
    @Min(1)
    @Max(5)
    private Integer rating;
}
