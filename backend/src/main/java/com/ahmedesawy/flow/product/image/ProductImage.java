package com.ahmedesawy.flow.product.image;

import com.ahmedesawy.flow.product.Product;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_images")
@Getter
@Setter
public class ProductImage {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   private String imageUrl;

   @ManyToOne
   @JoinColumn(name = "product_id", foreignKey = @ForeignKey(name = "fk_images_product"))
   @JsonBackReference("product-images")
   private Product product;

}