package com.ahmedesawy.petalia.product.comment;

import com.ahmedesawy.petalia.product.comment.dto.CommentResponse;
import com.ahmedesawy.petalia.user.customer.Customer;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor 
public class CommentMapper {

    // ---- MAIN
    public static  CommentResponse toResponse(Comment comment, Customer customer) {
        return CommentResponse.builder()
                .id(comment.getId())
                .customerId(comment.getCustomerId())
                .customerName(customer.getUserName())
                .customerImage(customer.getImageUrl())
                .content(comment.getContent())
                .rating(comment.getRating())
                .build();
    }

}
