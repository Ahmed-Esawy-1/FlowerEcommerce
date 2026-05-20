package com.ecommerce.dashboard.dto.request.order;

import com.ecommerce.dashboard.model.OrderStatus;

public class UpdateOrderStatusRequest {

   private OrderStatus status;

   public OrderStatus getStatus() {
      return status;
   }

   public void setStatus(OrderStatus status) {
      this.status = status;
   }
}