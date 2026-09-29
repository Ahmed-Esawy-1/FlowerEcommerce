package com.ahmedesawy.petalia.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class CategorySimpleResponse {
    private Integer id;
    private String nameEn;
    private String nameAr;
}