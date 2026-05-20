package com.ecommerce.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.dashboard.model.ProductColorImage;

public interface ProductColorImageRepository extends JpaRepository<ProductColorImage, Long> {
   
}