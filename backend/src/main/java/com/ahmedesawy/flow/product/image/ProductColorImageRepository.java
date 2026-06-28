package com.ahmedesawy.flow.product.image;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductColorImageRepository extends JpaRepository<ProductColorImage, Long> {

   // Find By Product Id & Product Color Id
   Optional<ProductColorImage> findByIdAndProductColorId(Long id, Long productColorId);
   // Find All By Product Id & Product Color Id
   List<ProductColorImage> findAllByIdInAndProductColorId(List<Long> ids, Long productColorId);
   // Find By Product Color Id | Sort By Order 
   List<ProductColorImage> findByProductColorIdOrderBySortOrderAsc(Long productColorId);
   
}