package com.ahmedesawy.petalia.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.ahmedesawy.petalia.order.OrderStatus;
import com.ahmedesawy.petalia.order.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailResponse {
    private String orderId;
    private String fullName;
    private BigDecimal totalPrice;
    private BigDecimal deliveryPrice;
    private BigDecimal discountAmount;
    private OrderStatus status;
    private Payment paymentMethod;
    private String cityNameEn;
    private String cityNameAr;
    private String shippingAddress;
    private String hint;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
}
