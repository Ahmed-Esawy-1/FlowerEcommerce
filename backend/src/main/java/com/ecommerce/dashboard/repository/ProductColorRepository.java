package com.ecommerce.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.dashboard.model.ProductColor;

public interface ProductColorRepository extends JpaRepository<ProductColor, Long> {
      void deleteByProductId(Long productId);
}