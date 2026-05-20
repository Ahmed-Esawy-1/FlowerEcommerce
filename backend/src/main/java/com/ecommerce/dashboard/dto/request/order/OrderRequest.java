package com.ecommerce.dashboard.dto.request.order;

import java.util.List;

public class OrderRequest {
  private Long userId;
  private String address;
  private String paymentMethod;
  private List<OrderItemRequest> items;

  public Long getUserId() {
    return userId;
  }
  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getAddress() {
    return address;
  }
  public void setAddress(String address) {
    this.address = address;
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
