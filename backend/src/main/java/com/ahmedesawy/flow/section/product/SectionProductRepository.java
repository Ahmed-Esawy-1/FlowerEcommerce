package com.ahmedesawy.flow.section.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SectionProductRepository extends JpaRepository<SectionProduct, Long> {
   
   List<SectionProduct> findBySectionIdOrderBySortOrderAsc(Long sectionId);
   int countBySectionId(Long sectionId);
   void deleteBySectionIdAndProductId(Long sectionId, Long productId);
}
