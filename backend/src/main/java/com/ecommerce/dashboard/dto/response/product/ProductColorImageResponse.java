package com.ecommerce.dashboard.dto.response.product;

public class ProductColorImageResponse {
   Long id; 
   String imageUrl; 
   Integer sortOrder;


   public Long getId() {
      return id;
   }
   public void setId(Long id) {
      this.id = id;
   }

   public String getImageUrl() {
      return imageUrl;
   }
   public void setImageUrl(String imageUrl) {
      this.imageUrl = imageUrl;
   }

   public Integer getSortOrder() {
      return sortOrder;
   }
   public void setSortOrder(Integer sortOrder) {
      this.sortOrder = sortOrder;
   }

}

