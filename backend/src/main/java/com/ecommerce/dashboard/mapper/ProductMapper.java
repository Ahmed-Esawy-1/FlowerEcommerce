package com.ecommerce.dashboard.mapper;

import com.ecommerce.dashboard.model.Product;
import com.ecommerce.dashboard.dto.ProductResponse;
import java.util.List;

public class ProductMapper {

    public static ProductResponse mapToDto(Product product) {

        ProductResponse dto = new ProductResponse();

        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());

        dto.setCategoryId(
            product.getCategory() != null ? product.getCategory().getId() : null
        );

        List<String> images = product.getImages()
            .stream()
            .map(img -> "/api/upload_images/products/" + img.getImagePath())
            .toList();

        dto.setImagesPath(images);

        return dto;
    }
}