package com.ahmedesawy.flow.category.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CategoryResponse {

  private Long id;
  private String nameEn;
  private String nameAr;
  private String imageUrl;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private LocalDateTime deletedAt;
  
}