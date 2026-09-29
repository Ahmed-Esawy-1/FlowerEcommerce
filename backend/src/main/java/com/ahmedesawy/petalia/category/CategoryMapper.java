package com.ahmedesawy.petalia.category;

import com.ahmedesawy.petalia.category.dto.CategoryResponse;
import com.ahmedesawy.petalia.category.dto.TrashCategoryResponse;
import com.ahmedesawy.petalia.common.util.ImageUrlResolver;

public class CategoryMapper {
   
   // ---- MAIN
   public static CategoryResponse toResponse(Category category) {
      return CategoryResponse.builder()
            .id(category.getId())
            .nameEn(category.getNameEn())
            .nameAr(category.getNameAr())
            .imageUrl(ImageUrlResolver.resolve("categories", category.getImageUrl()))
            .createdAt(category.getCreatedAt())
            .updatedAt(category.getUpdatedAt())
            .build();
   }

   // ---- TRASH
   public static TrashCategoryResponse toTrashResponse(Category category) {
      return  TrashCategoryResponse.builder()
            .id(category.getId())
            .nameEn(category.getNameEn())
            .nameAr(category.getNameAr())
            .imageUrl(ImageUrlResolver.resolve("categories", category.getImageUrl()))
            .deletedAt(category.getDeletedAt())
            .build();
   }
   
}
