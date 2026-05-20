package com.ecommerce.dashboard.dto.response.product;

import java.math.BigDecimal;
import java.util.List;

public class ProductSummaryResponse {

   private Long id;
   private String title;
   private BigDecimal price;
   private String firstImage;
   private List<ProductColorResponse> colors;

   public Long getId() {
      return id;
   }
   public void setId(Long id) {
      this.id = id;
   }

   public String getTitle() {
      return title;
   }
   public void setTitle(String title) {
      this.title = title;
   }

   public BigDecimal getPrice() {
      return price;
   }
   public void setPrice(BigDecimal price) {
      this.price = price;
   }

   public String getFirstImage() {
      return firstImage;
   }
   public void setFirstImage(String firstImage) {
      this.firstImage = firstImage;
   }

   public List<ProductColorResponse> getColors() {
      return colors;
   }
   public void setColors(List<ProductColorResponse> colors) {
      this.colors = colors;
   }
   
}
