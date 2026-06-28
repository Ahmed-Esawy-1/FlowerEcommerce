package com.ahmedesawy.flow.product.dto.response;

import java.math.BigDecimal;

import com.ahmedesawy.flow.category.dto.CategorySimpleResponse;
import com.ahmedesawy.flow.occasion.dto.OccasionSimpleResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductSummaryResponse {

   private Long id;
   private String title;
   private BigDecimal price;
   private String description;

   private CategorySimpleResponse category;
   private OccasionSimpleResponse occasion;
   
   private String primaryImageUrl;

}
