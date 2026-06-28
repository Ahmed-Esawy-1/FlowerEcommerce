package com.ahmedesawy.flow.section.dto.response;

import java.util.List;

import com.ahmedesawy.flow.product.dto.response.ProductResponse;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class SectionResponse {

   Long id;
   String nameEn;
   String nameAr;
   Boolean isActive;
   List<ProductResponse> products;

}
