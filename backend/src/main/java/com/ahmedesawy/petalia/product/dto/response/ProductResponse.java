package com.ahmedesawy.petalia.product.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductResponse extends ProductSummaryResponse {
    private Boolean hasColor;
    private List<ProductImageResponse> images;
    private List<ProductColorResponse> productColors;
    private Boolean hasOffer;
    private ProductOfferResponse offer;
}