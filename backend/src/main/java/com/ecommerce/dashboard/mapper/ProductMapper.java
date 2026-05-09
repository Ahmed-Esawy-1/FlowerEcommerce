package com.ecommerce.dashboard.mapper;

import com.ecommerce.dashboard.dto.response.CategorySimpleResponse;
import com.ecommerce.dashboard.dto.response.ProductImageResponse;
import com.ecommerce.dashboard.dto.response.ProductResponse;
import com.ecommerce.dashboard.model.Product;

import java.util.List;

public class ProductMapper {

    public static ProductResponse mapToDto(Product product) {

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setTitle(product.getTitle());
        response.setPrice(product.getPrice());
        response.setDescription(product.getDescription());

        CategorySimpleResponse cat = null;
        if(product.getCategory() != null) {
            cat = new CategorySimpleResponse();
            cat.setId(product.getCategory().getId());
            cat.setName(product.getCategory().getName());
        }

        response.setCategory(cat);

        List<ProductImageResponse> images = 
        product.getImages() != null ?
            product.getImages()
            .stream()
            .map(img -> { 
                ProductImageResponse imageResponse = new ProductImageResponse();

                imageResponse.setId(img.getId());
                imageResponse.setUrl("/api/upload_images/products/" + img.getUrl());
        
                return imageResponse;
            })
            .toList()
            :List.of();

        response.setImages(images);
        

        return response;
    }
}