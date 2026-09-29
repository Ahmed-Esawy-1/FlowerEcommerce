package com.ahmedesawy.petalia.product.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ahmedesawy.petalia.common.base.DiscountType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductOfferResponse {
    private DiscountType discountType;
    private BigDecimal discountValue;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Boolean isActive;
}
