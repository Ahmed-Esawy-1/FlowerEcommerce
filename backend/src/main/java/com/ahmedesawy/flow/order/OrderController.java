package com.ahmedesawy.flow.order;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.flow.order.dto.request.OrderRequest;
import com.ahmedesawy.flow.order.dto.request.UpdateOrderStatusRequest;
import com.ahmedesawy.flow.order.dto.response.OrderDetailResponse;
import com.ahmedesawy.flow.order.dto.response.OrderSummaryResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

   private final OrderService orderService;


   // Get All Orders ( Summary )
   @GetMapping
   public ResponseEntity<Page<OrderSummaryResponse>> getOrders(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) OrderStatus status
   ) {
      return ResponseEntity.ok(orderService.getAllOrdersSummary(page, size, status));
   }

   // Get Order By ID ( Detail )
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
   @DeleteMapping("/{id}/permanent")
   public void deleteOrder(@PathVariable Long id) {
      orderService.deleteOrder(id);
   }

}
