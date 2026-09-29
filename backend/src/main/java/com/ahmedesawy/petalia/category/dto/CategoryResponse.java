package com.ahmedesawy.petalia.category.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Integer id;
    private String nameEn;
    private String nameAr;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}