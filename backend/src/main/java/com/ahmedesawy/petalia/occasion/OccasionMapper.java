package com.ahmedesawy.petalia.occasion;

import com.ahmedesawy.petalia.common.util.ImageUrlResolver;
import com.ahmedesawy.petalia.occasion.dto.OccasionResponse;
import com.ahmedesawy.petalia.occasion.dto.TrashOccasionResponse;

public class OccasionMapper {
   
   // ---- MAIN 
   public static OccasionResponse toResponse(Occasion occasion) {
      return OccasionResponse.builder()
            .id(occasion.getId())
            .nameEn(occasion.getNameEn())
            .nameAr(occasion.getNameAr())
            .imageUrl(ImageUrlResolver.resolve("occasions", occasion.getImageUrl()))
            .createdAt(occasion.getCreatedAt())
            .updatedAt(occasion.getUpdatedAt())
            .build();
   }

   // ---- TRASH
   public static TrashOccasionResponse toTrashResponse(Occasion occasion) {
      return TrashOccasionResponse.builder()
            .id(occasion.getId())
            .nameEn(occasion.getNameEn())
            .nameAr(occasion.getNameAr())
            .imageUrl(ImageUrlResolver.resolve("occasions", occasion.getImageUrl()))
            .deletedAt(occasion.getDeletedAt())
            .build();
   }

}
