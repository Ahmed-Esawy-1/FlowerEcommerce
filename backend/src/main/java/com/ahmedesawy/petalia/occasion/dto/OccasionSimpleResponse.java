package com.ahmedesawy.petalia.occasion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class OccasionSimpleResponse {
   private Integer id;
   private String nameEn;
   private String nameAr;
}
