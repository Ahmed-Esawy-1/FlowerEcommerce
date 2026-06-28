package com.ahmedesawy.flow.order.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
  
  private Long userId;
  private String address;
  private String paymentMethod;
  private List<OrderItemRequest> items;

}
