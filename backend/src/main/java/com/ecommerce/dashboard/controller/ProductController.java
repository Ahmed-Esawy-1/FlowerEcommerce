package com.ecommerce.dashboard.controller;


import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.response.ProductResponse;
import com.ecommerce.dashboard.model.Product;
import com.ecommerce.dashboard.repository.ProductRepository;
import com.ecommerce.dashboard.service.ProductService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;





@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:5173") // allow React app
public class ProductController {

  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }


  @Autowired
  ProductRepository repository;



  @Value("${file.upload-dir}")
    private String uploadDir;

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

  // Create Product
  @PostMapping(consumes = "multipart/form-data")
  public Product createProduct(
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("price") Double price,
        @RequestParam(value = "categoryId", required = false) Long categoryId,
        @RequestParam("images") List<MultipartFile> files)
  {
    return productService.create(title, description, price, categoryId, files);
  }

  // Update Product
  @PutMapping(value = "/{id}", consumes = "multipart/form-data")
  public Product updateProduct(
    @PathVariable Long id,
    @RequestParam("title") String title,
    @RequestParam("description") String description,
    @RequestParam("price") Double price,
    @RequestParam(value = "categoryId", required = false) Long categoryId,
    @RequestParam(value = "newImages", required = false) List<MultipartFile> newImages,
    @RequestParam(value = "removedImagesIds", required = false) List<Long> removedImagesIds
  ) {
    return productService.update(
      id, title, description, price, categoryId, newImages, removedImagesIds
    );
  }


  // Delete Product
  @DeleteMapping("/{id}")
  public void deleteProduct(@PathVariable Long id) {
    productService.delete(id);
  }
  
  
  
}
