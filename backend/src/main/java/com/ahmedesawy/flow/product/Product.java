package com.ahmedesawy.flow.product;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.List;

import com.ahmedesawy.flow.category.Category;
import com.ahmedesawy.flow.common.base.BaseEntity;
import com.ahmedesawy.flow.occasion.Occasion;
import com.ahmedesawy.flow.product.color.ProductColor;
import com.ahmedesawy.flow.product.image.ProductImage;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "products")
@NoArgsConstructor
@Getter
@Setter
public class Product extends BaseEntity {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false)
   private String title;

   @Column(columnDefinition = "TEXT")
   private String description;

   @Column(nullable = false, precision = 10, scale = 2)
   private BigDecimal price;

   @Column(nullable = false)
   private Boolean hasColor = false;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "category_id", foreignKey = @ForeignKey(name = "fk_products_category"))
   private Category category;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "occasion_id", foreignKey = @ForeignKey(name = "fk_products_occasion"))
   private Occasion occasion;

   @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
   @OrderBy("id ASC")
   private List<ProductImage> images = new ArrayList<>();

   @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
   @OrderBy("id ASC")
   private List<ProductColor> productColors = new ArrayList<>();

}
