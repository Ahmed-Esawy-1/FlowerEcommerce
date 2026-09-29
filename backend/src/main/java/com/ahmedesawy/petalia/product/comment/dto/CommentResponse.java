package com.ahmedesawy.petalia.product.comment.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 
public class CommentResponse {
    private Long id;
    private UUID customerId;
    private String customerName;
    private String customerImage;
    private String content;
    private Integer rating;
}