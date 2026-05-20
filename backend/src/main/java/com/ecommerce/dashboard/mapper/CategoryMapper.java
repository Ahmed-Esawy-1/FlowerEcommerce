package com.ecommerce.dashboard.mapper;



import com.ecommerce.dashboard.dto.response.category.CategoryResponse;
import com.ecommerce.dashboard.model.Category;

public class CategoryMapper {
  
  public static CategoryResponse mapToDto(Category category) {
    CategoryResponse response = new CategoryResponse();

    response.setId(category.getId());
    response.setName(category.getName());

    if (category.getImageUrl() != null) {
      response.setImageUrl("/api/upload_images/categories/" + category.getImageUrl());
    } else {
      response.setImageUrl(null);
    }
    
    response.setCreatedAt(category.getCreatedAt());



    return response;

  }
}
