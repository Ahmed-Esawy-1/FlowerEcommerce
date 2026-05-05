package com.ecommerce.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.dashboard.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {


}