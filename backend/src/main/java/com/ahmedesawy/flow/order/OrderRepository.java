package com.ahmedesawy.flow.order;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

   Page<Order> findByStatus(OrderStatus status, Pageable pageable);

   // (Recent 5 Orders)
   List<Order> findTop5ByOrderByCreatedAtDesc();

   // Top 5 Most Ordered Products (Top Products)
   @Query("""
      SELECT oi.product.id, oi.product.title, COUNT(oi.product.id) as orderCount
      FROM OrderItem oi
      GROUP BY oi.product.id, oi.product.title
      ORDER BY orderCount DESC
   """)
   List<Object[]> findTop5ProductsByOrderCount(Pageable pageable);

   // Number of Orders By Status (ex: 4 Completed, 7 Pending)
   long countByStatus(OrderStatus status);

   // Total Price Per Year (Delivered only)
   @Query("""
      SELECT COALESCE(SUM(o.totalPrice), 0)
      FROM Order o
      WHERE o.status = :status
      AND YEAR(o.createdAt) = :year
   """)
   BigDecimal sumRevenueByStatusAndYear(@Param("status") OrderStatus status, @Param("year") int year);

}