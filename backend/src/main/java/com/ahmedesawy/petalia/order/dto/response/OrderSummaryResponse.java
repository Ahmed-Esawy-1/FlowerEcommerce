package com.ahmedesawy.petalia.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ahmedesawy.petalia.order.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder 
public class OrderSummaryResponse {
   private Long id;
   private String fullName;
   private String customerName;
   private String customerEmail;
   private String customerImage;
   private LocalDateTime createdAt;
   private BigDecimal totalPrice;
   private BigDecimal deliveryPrice;
   private BigDecimal discountAmount;
   private OrderStatus status;
}
