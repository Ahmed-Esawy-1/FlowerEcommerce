package com.ahmedesawy.flow.product.color;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import com.ahmedesawy.flow.color.Color;
import com.ahmedesawy.flow.common.base.BaseEntity;
import com.ahmedesawy.flow.product.Product;
import com.ahmedesawy.flow.product.image.ProductColorImage;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "product_color")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductColor extends BaseEntity {

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
   private List<ProductColorImage> images = new ArrayList<>();

   @Column(nullable = false)
   private Boolean available = false;

}