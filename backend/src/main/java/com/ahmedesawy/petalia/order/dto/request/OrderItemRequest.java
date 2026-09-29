package com.ahmedesawy.petalia.order.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequest {
    @NotNull(message = "Product Id is required")
    private Long productId;
    @Positive
    private Integer quantity;
}
