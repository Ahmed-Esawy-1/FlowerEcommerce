package com.ecommerce.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.dashboard.model.SectionProduct;

public interface SectionProductRepository extends JpaRepository<SectionProduct, Long> {
   List<SectionProduct> findBySectionIdOrderBySortOrderAsc(Long sectionId);
   int countBySectionId(Long sectionId);
   void deleteBySectionIdAndProductId(Long sectionId, Long productId);
}
