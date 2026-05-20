package com.ecommerce.dashboard.model;

import java.util.List;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "product_color")
public class ProductColor {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @ManyToOne
   @JoinColumn(name = "color_id")
   private Color color;

   @ManyToOne
   @JoinColumn(name = "product_id", nullable = false,
         foreignKey = @ForeignKey(name = "fk_color_product"))
   @JsonBackReference("product-colors")
   private Product product;

   @OneToMany(mappedBy = "productColor", cascade = CascadeType.ALL, orphanRemoval = true)
   @JsonManagedReference("color-images")
   private List<ProductColorImage> images;

   
   public Long getId() { 
      return id; 
   }
   public void setId(Long id) { 
      this.id = id; 
   }

   public Color getColor() {
      return color;
   }
   public void setColor(Color color) {
      this.color = color;
   }

   public Product getProduct() { 
      return product; 
   }
   public void setProduct(Product product) { this.product = product; }

   public List<ProductColorImage> getImages() { 
      return images; 
   }
   public void setImages(List<ProductColorImage> images) { 
      this.images = images; 
   }
   
}