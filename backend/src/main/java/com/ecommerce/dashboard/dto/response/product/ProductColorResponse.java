package com.ecommerce.dashboard.dto.response.product;

import java.util.List;

public class ProductColorResponse {

   Long id;
   String name;
   String hexCode;
   List<ProductColorImageResponse> images;

   public Long getId() {
      return id;
   }
   public void setId(Long id) {
      this.id = id;
   }

   public String getName() {
      return name;
   }
   public void setName(String name) {
      this.name = name;
   }

   public String getHexCode() {
      return hexCode;
   }
   public void setHexCode(String hexCode) {
      this.hexCode = hexCode;
   }
   
   public List<ProductColorImageResponse> getImages() {
      return images;
   }
   public void setImages(List<ProductColorImageResponse> images) {
      this.images = images;
   }

   

}
