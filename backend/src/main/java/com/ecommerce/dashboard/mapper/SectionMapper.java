package com.ecommerce.dashboard.mapper;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.ecommerce.dashboard.dto.request.section.SectionRequest;
import com.ecommerce.dashboard.dto.response.product.ProductResponse;
import com.ecommerce.dashboard.dto.response.section.SectionProductResponse;
import com.ecommerce.dashboard.dto.response.section.SectionResponse;
import com.ecommerce.dashboard.model.Section;
import com.ecommerce.dashboard.model.SectionProduct;
import com.ecommerce.dashboard.repository.ProductRepository;

@Component
public class SectionMapper {

   private final ProductRepository productRepo;



   

   public SectionMapper(ProductRepository productRepo) {
      this.productRepo = productRepo;
;
   }

   public SectionResponse toResponse(Section section) {
      List<ProductResponse> products = section.getSectionProducts()
            .stream()
            .sorted(Comparator.comparingInt(SectionProduct::getSortOrder))
            .map(sp -> toProductData(sp.getProductId()))  // ← cleaner
            .filter(Objects::nonNull)
            .toList();

      return new SectionResponse(
            section.getId(),
            section.getName(),
            section.getIsActive(),
            products
      );
  }

  private ProductResponse toProductData(Long productId) {
   return productRepo.findById(productId)
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
      section.setName(req.name());
      section.setIsActive(req.isActive() != null ? req.isActive() : true);
      return section;
   }
}