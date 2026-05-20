package com.ecommerce.dashboard.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

@Entity
@Table(name = "section")
public class Section {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, length = 100)
   private String name;

   @Column(nullable = false)
   private Boolean isActive = true;

   @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
   @OrderBy("sortOrder ASC")
   private List<SectionProduct> sectionProducts = new ArrayList<>();


   public Long getId() {
      return id;
   }
   public void setId(Long id) {
      this.id = id;
   }

   public String getName() {
      return name;
   }
   public void setName(String name) {
      this.name = name;
   }

   public Boolean getIsActive() {
      return isActive;
   }
   public void setIsActive(Boolean isActive) {
      this.isActive = isActive;
   }

   public List<SectionProduct> getSectionProducts() {
      return sectionProducts;
   }
   public void setSectionProducts(List<SectionProduct> sectionProducts) {
      this.sectionProducts = sectionProducts;
   }


   
}
