package com.ahmedesawy.flow.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ahmedesawy.flow.order.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderSummaryResponse {
   
   private Long id;
   private String customerName;
   private String customerEmail;
   private String customerImage;
   private LocalDateTime createdAt;
   private BigDecimal totalPrice;
   private OrderStatus status;

}
