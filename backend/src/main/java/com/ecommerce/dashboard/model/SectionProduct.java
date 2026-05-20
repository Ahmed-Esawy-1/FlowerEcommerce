package com.ecommerce.dashboard.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "section_product",
      uniqueConstraints = @UniqueConstraint(columnNames = {"section_id", "product_id"}))

public class SectionProduct {

      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;

      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "section_id", nullable = false)
      private Section section;

      @Column(name = "product_id", nullable = false)
      private Long productId;

      @Column(name = "sort_order", nullable = false)
      private Integer sortOrder = 0;

      public Long getId() {
            return id;
      }

      public void setId(Long id) {
            this.id = id;
      }

      public Section getSection() {
         return section;
      }

      public void setSection(Section section) {
         this.section = section;
      }

      public Long getProductId() {
         return productId;
      }

      public void setProductId(Long productId) {
         this.productId = productId;
      }

      public Integer getSortOrder() {
         return sortOrder;
      }

      public void setSortOrder(Integer sortOrder) {
         this.sortOrder = sortOrder;
      }

   
}
