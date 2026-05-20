package com.ecommerce.dashboard.controller;


import java.util.List;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.product.AddProductColorRequest;
import com.ecommerce.dashboard.dto.request.product.CreateProductRequest;
import com.ecommerce.dashboard.dto.request.product.UpdateProductRequest;
import com.ecommerce.dashboard.dto.response.product.ProductColorImageResponse;
import com.ecommerce.dashboard.dto.response.product.ProductResponse;
import com.ecommerce.dashboard.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/products")
public class ProductController {

   private final ProductService productService;

   public ProductController(ProductService productService) {
      this.productService = productService;
   }


   // Get All Products
   @GetMapping
   public List<ProductResponse> getProducts() {
      return productService.getAllProducts();
   }

   // Get  Product By ID
   @GetMapping("/{id}")
   public ProductResponse getProductById(@PathVariable Long id) {
      return productService.getProduct(id);
   }

   // Products By Occasion Id
   @GetMapping("/occasion/{occasionId}")
   public List<ProductResponse> getByOccasion(@PathVariable Long occasionId) { 
      return productService.getByOccasionId(occasionId);
   }

   // Products By Occasion Name
   @GetMapping("/occasion")
      public List<ProductResponse> getByOccasionName(@RequestParam String name) { 
      return productService.getByOccasionName(name);
   }

   // Best Seller
   @GetMapping("/best-sellers")
   public List<ProductResponse> getBestSellers() { 
      return productService.getBestSellers();
   }


   // Create Product
   @PostMapping(consumes = "multipart/form-data")
   public ProductResponse createProduct(
      @Valid @ModelAttribute CreateProductRequest request,
      @RequestParam("images") List<MultipartFile> files)
   {
      return productService.create(request, files);
   }

  // Update Product
   @PutMapping(value = "/{id}", consumes = "multipart/form-data")
   public ProductResponse updateProduct(
      @PathVariable Long id,
      @Valid @ModelAttribute UpdateProductRequest request,
      @RequestParam(value = "newImages", required = false) List<MultipartFile> newImages
   ) {
      return productService.update(id, request, newImages);
   }


  // Delete Product
   @DeleteMapping("/{id}")
   public void deleteProduct(@PathVariable Long id) {
      productService.deleteProduct(id);
   }

}
