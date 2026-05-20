package com.ecommerce.dashboard.dto.request.product;

import java.math.BigDecimal;
import java.util.List;

public class UpdateProductRequest {

  private String title;
  private String description;
  private BigDecimal price;
  private Long categoryId;
  private Long occasionId;
  private List<Long> removedImageIds;


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

  public List<Long> getRemovedImageIds() {
    return removedImageIds;
  }
  public void setRemovedImageIds(List<Long> removedImageIds) {
    this.removedImageIds = removedImageIds;
  }

}