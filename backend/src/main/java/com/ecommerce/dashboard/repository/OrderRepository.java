package com.ecommerce.dashboard.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.dashboard.model.Order;
import com.ecommerce.dashboard.model.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {
   Page<Order> findByStatus(OrderStatus status, Pageable pageable);
}
