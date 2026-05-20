package com.ecommerce.dashboard.dto.response.order;

import java.math.BigDecimal;

import com.ecommerce.dashboard.dto.response.product.ProductSummaryResponse;

public class OrderItemResponse {

   private Long id;
   private ProductSummaryResponse product;
   private Integer quantity;
   private BigDecimal price;

   public Long getId() {
      return id;
   }
   public void setId(Long id) {
      this.id = id;
   }

   public ProductSummaryResponse getProduct() {
      return product;
   }

   public void setProduct(ProductSummaryResponse product) {
      this.product = product;
   }

   public Integer getQuantity() {
      return quantity;
   }
   public void setQuantity(Integer quantity) {
      this.quantity = quantity;
   }

   public BigDecimal getPrice() {
      return price;
   }
   public void setPrice(BigDecimal price) {
      this.price = price;
   }

   

}
