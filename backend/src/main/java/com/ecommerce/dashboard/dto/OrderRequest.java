package com.ecommerce.dashboard.dto;

import java.util.List;

public class OrderRequest {
  private Long userId;
  private String shippingAddress;
  private String paymentMethod;
  private List<OrderItemRequest> items;

  public Long getUserId() {
    return userId;
  }
  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getShippingAddress() {
    return shippingAddress;
  }
  public void setShippingAddress(String shippingAddress) {
    this.shippingAddress = shippingAddress;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }
  public void setPaymentMethod(String paymentMethod) {
    this.paymentMethod = paymentMethod;
  }
  
  public List<OrderItemRequest> getItems() {
    return items;
  }
  public void setItems(List<OrderItemRequest> items) {
    this.items = items;
  }

  
}
