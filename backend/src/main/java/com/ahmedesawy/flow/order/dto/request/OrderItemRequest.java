package com.ahmedesawy.flow.order.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequest {
  
  @NotBlank
  private Long productId;
  @Positive
  private Integer quantity;

}
