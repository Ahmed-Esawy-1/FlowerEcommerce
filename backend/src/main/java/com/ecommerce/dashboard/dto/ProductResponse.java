package com.ecommerce.dashboard.dto;

import java.util.List;

public class ProductResponse {
  private Long id;
  private String title;
  private double price;
  private String description;
  private Long categoryId;
  private List<String> imagesPath;
  
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
  public double getPrice() {
    return price;
  }
  public void setPrice(double price) {
    this.price = price;
  }
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
  public Long getCategoryId() {
    return categoryId;
  }
  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }
  public List<String> getImagesPath() {
    return imagesPath;
  }
  public void setImagesPath(List<String> imagesPath) {
    this.imagesPath = imagesPath;
  }

  

}