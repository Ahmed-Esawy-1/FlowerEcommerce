package com.ahmedesawy.flow.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class CategorySimpleResponse {

  private Long id;
  private String nameEn;
  private String nameAr;

}