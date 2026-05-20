package com.ecommerce.dashboard.dto.request.product;


import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;




public class CreateProductRequest {

  @NotBlank
  private String title;

  @NotBlank
  private String description;

  @NotNull
  @Positive
  private BigDecimal price;

  private Long categoryId;
  private Long occasionId;


  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }
  
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }

  public BigDecimal getPrice() {
    return price;
  }
  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public Long getCategoryId() {
    return categoryId;
  }
  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public Long getOccasionId() {
    return occasionId;
  }
  public void setOccasionId(Long occasionId) {
    this.occasionId = occasionId;
  }

}
