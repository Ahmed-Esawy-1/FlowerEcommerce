package com.ahmedesawy.flow.product.dto.request;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class FullUpdateRequest {

   private String title;
   private String description;
   private Double price;
   private Boolean hasColor;
   private Long categoryId;
   private Long occasionId;
   private Boolean modeSwitched;
   private List<Long> removeImageIds;
   private List<Long> removeColorIds;
   
}