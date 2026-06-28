package com.ahmedesawy.flow.section;

import java.util.ArrayList;
import java.util.List;

import com.ahmedesawy.flow.common.base.BaseEntity;
import com.ahmedesawy.flow.section.product.SectionProduct;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "section")
@Getter
@Setter
public class Section extends BaseEntity {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, length = 100)
   private String nameEn;

   @Column(nullable = false, length = 100)
   private String nameAr;
   

   @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
   @OrderBy("sortOrder ASC")
   private List<SectionProduct> sectionProducts = new ArrayList<>();

}
