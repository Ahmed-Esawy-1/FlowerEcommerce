package com.ahmedesawy.flow.product.dto.request;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFilterRequest {

   private List<Long> categoryIds;
   private List<Long> occasionIds;
   private List<Long> colorIds;
   private BigDecimal minPrice;
   private BigDecimal maxPrice;

}
