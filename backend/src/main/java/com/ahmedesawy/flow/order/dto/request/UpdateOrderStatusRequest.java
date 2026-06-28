package com.ahmedesawy.flow.order.dto.request;

import com.ahmedesawy.flow.order.OrderStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequest {

   private OrderStatus status;

}