package com.ahmedesawy.flow.color;

import com.ahmedesawy.flow.common.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "colors")
@NoArgsConstructor
@Getter
@Setter
public class Color extends BaseEntity {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, unique = true)
   private String nameEn;

   @Column(nullable = false, unique = true)
   private String nameAr;

   @Column(nullable = false)
   private String hexCode;

}
