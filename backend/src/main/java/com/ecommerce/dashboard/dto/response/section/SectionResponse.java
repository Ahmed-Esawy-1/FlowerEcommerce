package com.ecommerce.dashboard.dto.response.section;

import java.util.List;

import com.ecommerce.dashboard.dto.response.product.ProductResponse;

public record SectionResponse(Long id, String name, Boolean isActive, List<ProductResponse> products) {}
