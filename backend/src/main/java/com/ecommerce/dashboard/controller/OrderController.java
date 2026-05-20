package com.ecommerce.dashboard.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dashboard.dto.request.order.OrderRequest;
import com.ecommerce.dashboard.dto.request.order.UpdateOrderStatusRequest;
import com.ecommerce.dashboard.dto.response.order.OrderDetailResponse;
import com.ecommerce.dashboard.dto.response.order.OrderSummaryResponse;
import com.ecommerce.dashboard.model.Order;
import com.ecommerce.dashboard.model.OrderStatus;
import com.ecommerce.dashboard.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/orders")
public class OrderController {

   private final OrderService orderService;

   public OrderController(OrderService orderService) {
      this.orderService = orderService;
   }

   // All Orders
   @GetMapping
   public ResponseEntity<Page<OrderSummaryResponse>> getOrders(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) OrderStatus status
   ) {
      return ResponseEntity.ok(orderService.getAllOrders(page, size, status));
   }

   // Order By Id
   @GetMapping("/{id}")
   public OrderDetailResponse getOrderById(@PathVariable Long id) {
      return orderService.getOrderById(id);
   }

   // Create Order
   @PostMapping
   public Order createOrder(@Valid @RequestBody OrderRequest request) {
      return orderService.createOrder(request);
   }

   // Update Order
   @PutMapping("/{id}")
   public OrderDetailResponse updateOrder(
         @PathVariable Long id,
         @Valid @RequestBody OrderRequest request
   ) {
      return orderService.updateOrder(id, request);
   }

   // Update Order Status Only
   @PatchMapping("/{id}/status")
   public OrderDetailResponse updateOrderStatus(
         @PathVariable Long id,
         @RequestBody UpdateOrderStatusRequest request
   ) {
      return orderService.updateOrderStatus(id, request);
   }

   // Delete Order
   @DeleteMapping("/{id}")
   public void deleteOrder(@PathVariable Long id) {
      orderService.deleteOrder(id);
   }

}
