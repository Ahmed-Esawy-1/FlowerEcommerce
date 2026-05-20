package com.ecommerce.dashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecommerce.dashboard.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
   List<Product> findByOccasionId(Long occasionId);

   @Query("SELECT p FROM Product p JOIN p.occasion o WHERE LOWER(o.name) LIKE LOWER(CONCAT('%', :name, '%'))")
   List<Product> findByOccasionName(@Param("name") String name);

   @Query("""
      SELECT p FROM Product p
      JOIN OrderItem oi ON oi.product = p
      GROUP BY p
      ORDER BY SUM(oi.quantity) DESC
      LIMIT 8
   """)
   List<Product> findBestSellers();
}