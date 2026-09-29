package com.ahmedesawy.petalia.product.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.ahmedesawy.petalia.category.dto.CategorySimpleResponse;
import com.ahmedesawy.petalia.occasion.dto.OccasionSimpleResponse;

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
   private String nameEn;
   private String nameAr;
   private BigDecimal price;
   private String descriptionEn;
   private String descriptionAr;

   private List<CategorySimpleResponse> categories;
   private List<OccasionSimpleResponse> occasions;
   
   private String primaryImageUrl;
   private BigDecimal priceAfterDisount;

}
