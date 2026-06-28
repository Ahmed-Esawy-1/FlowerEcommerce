package com.ahmedesawy.flow.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.ahmedesawy.flow.order.OrderStatus;
import com.ahmedesawy.flow.user.dto.response.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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

}
