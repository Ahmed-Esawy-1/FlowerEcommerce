package com.ecommerce.dashboard.mapper;

import com.ecommerce.dashboard.model.Occasion;

public class OccasionMapper {
  
  public static Occasion mapToDto(Occasion occasion) {
    Occasion newOccasion = new Occasion();
    newOccasion.setId(occasion.getId());
    newOccasion.setName(occasion.getName());
    if(occasion.getImageUrl() != null) {
      newOccasion.setImageUrl("/api/upload_images/occasions/" + occasion.getImageUrl());
    }

    return newOccasion;
  }
}
