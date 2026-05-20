package com.ecommerce.dashboard.dto.response.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.ecommerce.dashboard.dto.response.user.UserResponse;
import com.ecommerce.dashboard.model.OrderStatus;

public class OrderDetailResponse {

   private Long id;
   private UserResponse user;
   private BigDecimal totalPrice;
   private OrderStatus status;
   private String paymentMethod;
   private String shippingAddress;
   private List<OrderItemResponse> items;
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;

   public Long getId() {
      return id;
   }
   public void setId(Long id) {
      this.id = id;
   }

   public UserResponse getUser() {
      return user;
   }
   public void setUser(UserResponse user) {
      this.user = user;
   }

   public BigDecimal getTotalPrice() {
      return totalPrice;
   }
   public void setTotalPrice(BigDecimal totalPrice) {
      this.totalPrice = totalPrice;
   }

   public OrderStatus getStatus() {
      return status;
   }
   public void setStatus(OrderStatus status) {
      this.status = status;
   }

   public String getPaymentMethod() {
      return paymentMethod;
   }
   public void setPaymentMethod(String paymentMethod) {
      this.paymentMethod = paymentMethod;
   }

   public String getShippingAddress() {
      return shippingAddress;
   }
   public void setShippingAddress(String shippingAddress) {
      this.shippingAddress = shippingAddress;
   }

   public List<OrderItemResponse> getItems() {
      return items;
   }
   public void setItems(List<OrderItemResponse> items) {
      this.items = items;
   }

   public LocalDateTime getCreatedAt() {
      return createdAt;
   }
   public void setCreatedAt(LocalDateTime createdAt) {
      this.createdAt = createdAt;
   }

   public LocalDateTime getUpdatedAt() {
      return updatedAt;
   }
   public void setUpdatedAt(LocalDateTime updatedAt) {
      this.updatedAt = updatedAt;
   }

}
