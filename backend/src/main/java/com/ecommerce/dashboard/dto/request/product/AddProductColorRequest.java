package com.ecommerce.dashboard.dto.request.product;

public class AddProductColorRequest {
   private String name;
   private String hexCode;

   public String getName() { return name; }
   public void setName(String name) { this.name = name; }

   public String getHexCode() { return hexCode; }
   public void setHexCode(String hexCode) { this.hexCode = hexCode; }
}