package com.ahmedesawy.flow.order.dto.response;

import java.math.BigDecimal;

import com.ahmedesawy.flow.product.dto.response.ProductSummaryResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderItemResponse {

   private Long id;
   private ProductSummaryResponse product;
   private Integer quantity;
   private BigDecimal price;

}
