package com.ahmedesawy.petalia.order.dto.request;

import java.util.List;

import com.ahmedesawy.petalia.order.Payment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {

    @NotBlank(message = "Your name is required")
    private String fullName;

    @NotNull(message = "Payment Method is required")   // ← Changed from @NotBlank
    private Payment paymentMethod;

    @NotBlank(message = "Your address is required")
    private String address;

    @NotNull(message = "City is required")
    private Integer cityId;

    private String couponCode;

    private String hint;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;
}