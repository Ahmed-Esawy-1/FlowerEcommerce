package com.ahmedesawy.flow.occasion;

public class OccasionMapper {
   

   public static Occasion mapToDto(Occasion occasion) {
      Occasion response = new Occasion();
      response.setId(occasion.getId());
      response.setNameEn(occasion.getNameEn());
      response.setNameAr(occasion.getNameAr());
      response.setCreatedAt(occasion.getCreatedAt());
      response.setUpdatedAt(occasion.getUpdatedAt());
      response.setDeletedAt(occasion.getDeletedAt());
      if(occasion.getImageUrl() != null) {
         response.setImageUrl("/api/upload_images/occasions/" + occasion.getImageUrl());
      }

      return response;
   }

}
