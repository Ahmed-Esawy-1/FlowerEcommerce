package com.ecommerce.dashboard.dto.response;

import java.util.List;

public class ProductResponse {

    private Long id;
    private String title;
    private double price;
    private String description;
    private CategorySimpleResponse category;

    private List<ProductImageResponse> images;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CategorySimpleResponse getCategory() {
        return category;
    }

    public void setCategory(CategorySimpleResponse category) {
        this.category = category;
    }

    public List<ProductImageResponse> getImages() {
        return images;
    }

    public void setImages(List<ProductImageResponse> images) {
        this.images = images;
    }
}