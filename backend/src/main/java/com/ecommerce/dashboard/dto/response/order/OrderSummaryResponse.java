package com.ecommerce.dashboard.dto.response.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ecommerce.dashboard.model.OrderStatus;


public class OrderSummaryResponse {
   private Long id;
   private String customerName;
   private String customerEmail;
   private String customerImage;
   private LocalDateTime createdAt;
   private BigDecimal totalPrice;
   private OrderStatus status;

   
   public Long getId() {
      return id;
   }
   public void setId(Long id) {
      this.id = id;
   }

   public String getCustomerName() {
      return customerName;
   }
   public void setCustomerName(String customerName) {
      this.customerName = customerName;
   }

   public String getCustomerEmail() {
      return customerEmail;
   }
   public void setCustomerEmail(String customerEmail) {
      this.customerEmail = customerEmail;
   }

   public String getCustomerImage() {
      return customerImage;
   }
   public void setCustomerImage(String customerImage) {
      this.customerImage = customerImage;
   }

   public LocalDateTime getCreatedAt() {
      return createdAt;
   }
   public void setCreatedAt(LocalDateTime createdAt) {
      this.createdAt = createdAt;
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

}
