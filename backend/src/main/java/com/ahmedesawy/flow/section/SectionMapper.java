package com.ahmedesawy.flow.section;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.ahmedesawy.flow.product.ProductMapper;
import com.ahmedesawy.flow.product.ProductRepository;
import com.ahmedesawy.flow.product.dto.response.ProductResponse;
import com.ahmedesawy.flow.section.dto.request.SectionRequest;
import com.ahmedesawy.flow.section.dto.response.SectionProductResponse;
import com.ahmedesawy.flow.section.dto.response.SectionResponse;
import com.ahmedesawy.flow.section.product.SectionProduct;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SectionMapper {

   private final ProductRepository productRepository;


   public SectionResponse toResponse(Section section) {
      List<ProductResponse> products = section.getSectionProducts()
            .stream()
            .sorted(Comparator.comparingInt(SectionProduct::getSortOrder))
            .map(sp -> toProductData(sp.getProductId()))  
            .filter(Objects::nonNull)
            .toList();

      return new SectionResponse(
            section.getId(),
            section.getNameEn(),
            section.getNameAr(),
            section.getDeletedAt() == null ? Boolean.TRUE: Boolean.FALSE ,
            products
      );
   }


   private ProductResponse toProductData(Long productId) {
      return productRepository.findById(productId)
            .map(ProductMapper::toResponse)
            .orElse(null);
   }



   public SectionProductResponse toProductResponse(SectionProduct sp) {
      return new SectionProductResponse(
            sp.getId(),
            sp.getProductId(),
            sp.getSortOrder()
      );
   }

   public Section toEntity(SectionRequest req) {
      Section section = new Section();
      section.setNameEn(req.getNameEn());
      section.setNameEn(req.getNameAr());
      return section;
   }
}