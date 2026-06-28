package com.ahmedesawy.flow.product;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ahmedesawy.flow.product.dto.response.ProductPriceRangeResponse;
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {


   // ---- Active Products ---------------------------------------------------------------------

   // List<Product> findByDeletedAtIsNull();

   List<Product> findByDeletedAtIsNullOrderByUpdatedAtDesc();

   Optional<Product> findByIdAndDeletedAtIsNull(Long id);

   List<Product> findByOccasionIdAndDeletedAtIsNull(Long occasionId);

   @Query("""
      SELECT p FROM Product p
      JOIN p.occasion o
      WHERE p.deletedAt IS NULL
      AND (
         LOWER(o.nameEn) LIKE LOWER(CONCAT('%', :name, '%'))
         OR
         LOWER(o.nameAr) LIKE LOWER(CONCAT('%', :name, '%'))
      )
   """)
   List<Product> findByOccasionNameAndDeletedAtIsNull(@Param("name") String name);

   @Query("""
      SELECT p FROM Product p
      JOIN OrderItem oi ON oi.product = p
      WHERE p.deletedAt IS NULL
      GROUP BY p
      ORDER BY SUM(oi.quantity) DESC
   """)
   List<Product> findBestSellers(Pageable pageable);

   // ---- Trash ---------------------------------------------------------------------

   List<Product> findByDeletedAtIsNotNull();

   @Modifying
   @Query("UPDATE Product p SET p.deletedAt = null WHERE p.id IN :ids")
   void restoreBulk(@Param("ids") List<Long> ids);

   @Modifying
   @Query("UPDATE Product p SET p.deletedAt = :now WHERE p.id IN :ids")
   void softDeleteBulk(@Param("ids") List<Long> ids, @Param("now") LocalDateTime now);

   // ---- Price Range ---------------------------------------------------------------------

   @Query("""
      SELECT new com.ahmedesawy.flow.product.dto.response.ProductPriceRangeResponse(
         MIN(p.price),
         MAX(p.price)
      )
      FROM Product p
      WHERE p.deletedAt IS NULL
   """)
   ProductPriceRangeResponse getPriceRange();


}