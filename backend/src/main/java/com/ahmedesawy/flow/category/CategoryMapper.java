package com.ahmedesawy.flow.category;



import com.ahmedesawy.flow.category.dto.CategoryResponse;

public class CategoryMapper {

   public static CategoryResponse mapToDto(Category category) {
      CategoryResponse response = new CategoryResponse();

      response.setId(category.getId());
      response.setNameEn(category.getNameEn());
      response.setNameAr(category.getNameAr());
      response.setCreatedAt(category.getCreatedAt());
      response.setUpdatedAt(category.getUpdatedAt());
      response.setDeletedAt(category.getDeletedAt());


      if (category.getImageUrl() != null) {
         response.setImageUrl("/api/upload_images/categories/" + category.getImageUrl());
      } else {
         response.setImageUrl(null);
      }

      return response;

   }
   
}
