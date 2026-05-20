package com.ecommerce.dashboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.product.AddProductColorRequest;
import com.ecommerce.dashboard.dto.response.product.ProductColorImageResponse;
import com.ecommerce.dashboard.dto.response.product.ProductResponse;
import com.ecommerce.dashboard.service.ProductColorService;
import com.ecommerce.dashboard.service.ProductService;

@RequestMapping("/products/{productId}/colors")
public class ProductColorController {

   private final ProductColorService productColorService;

   public ProductColorController(ProductColorService productColorService) {
      this.productColorService = productColorService;
   }



   // Get color images
   @GetMapping("/{colorId}/images")
   public List<ProductColorImageResponse> getColorImages(@PathVariable Long productId, @PathVariable Long colorId) {
      return productColorService.getColorImages(productId, colorId);
   }

   // Add color with images to a product
   @PostMapping(value = "/{id}/colors", consumes = "multipart/form-data")
      public ProductResponse addColor(
         @PathVariable Long id,
         @ModelAttribute AddProductColorRequest request,
         @RequestParam(value = "images", required = false) List<MultipartFile> files
      ) {
         return productColorService.addColor(id, request, files);
      }

   // Delete a color (and all its images)
   @DeleteMapping("/colors/{colorId}")
   public void deleteColor(@PathVariable Long colorId) {
      productColorService.deleteColor(colorId);
   }

   // Delete a single color image
   @DeleteMapping("/colors/images/{imageId}")
   public void deleteColorImage(@PathVariable Long imageId) {
      productColorService.deleteColorImage(imageId);
   }
  

}
