package com.ecommerce.dashboard.dto.response.product;

import java.math.BigDecimal;
import java.util.List;

import com.ecommerce.dashboard.dto.response.category.CategorySimpleResponse;
import com.ecommerce.dashboard.dto.response.occasion.OccasionSimpleResponse;

public class ProductResponse {

    private Long id;
    private String title;
    private BigDecimal price;
    private String description;
    private CategorySimpleResponse category;
    private OccasionSimpleResponse occasion;
    private String primaryImageUrl;
    private List<ProductImageResponse> images;
    private List<ProductColorResponse> colors;

    
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

    public BigDecimal getPrice() {
        return price;
    }
    public void setPrice(BigDecimal price) {
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

    public OccasionSimpleResponse getOccasion() {
        return occasion;
    }
    public void setOccasion(OccasionSimpleResponse occasion) {
        this.occasion = occasion;
    }

    public String getPrimaryImageUrl() {
        return primaryImageUrl;
    }
    public void setPrimaryImageUrl(String primaryImageUrl) {
        this.primaryImageUrl = primaryImageUrl;
    }

    public List<ProductImageResponse> getImages() {
        return images;
    }
    public void setImages(List<ProductImageResponse> images) {
        this.images = images;
    }

    public List<ProductColorResponse> getColors() {
        return colors;
    }
    public void setColors(List<ProductColorResponse> colors) {
        this.colors = colors;
    }

}