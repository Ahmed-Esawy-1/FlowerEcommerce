package com.ecommerce.dashboard.model;


import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;

@Entity
@Table(name = "product_color_image")
public class ProductColorImage {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private String imageUrl;
   private Integer sortOrder = 0;

   @ManyToOne
   @JoinColumn(name = "product_color_id", nullable = false,
         foreignKey = @ForeignKey(name = "fk_image_color"))
   @JsonBackReference("color-images")
   private ProductColor productColor;


   public Long getId() { return id; }
   public void setId(Long id) { this.id = id; }

   public String getImageUrl() { return imageUrl; }
   public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

   public Integer getSortOrder() { return sortOrder; }
   public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

   public ProductColor getProductColor() { return productColor; }
   public void setProductColor(ProductColor productColor) { this.productColor = productColor; }

}
