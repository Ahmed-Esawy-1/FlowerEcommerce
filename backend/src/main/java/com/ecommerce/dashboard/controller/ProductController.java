package com.ecommerce.dashboard.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.ProductResponse;
import com.ecommerce.dashboard.mapper.ProductMapper;
import com.ecommerce.dashboard.model.Category;
import com.ecommerce.dashboard.model.ProductImage;
import com.ecommerce.dashboard.model.Product;
import com.ecommerce.dashboard.repository.CategoryRepository;
import com.ecommerce.dashboard.repository.ProductImageRepository;
import com.ecommerce.dashboard.repository.ProductRepository;

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
  
  @Autowired
  ProductRepository repository;

  @Autowired
  private ProductImageRepository imageRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  @Value("${file.upload-dir}")
    private String uploadDir;

  // Get All Products
  @GetMapping
  public List<ProductResponse> getProducts() {
    return repository.findAll()
        .stream()
        .map(ProductMapper::mapToDto)
        .toList();
    }

  // Get  Product By ID
  @GetMapping("/{id}")
  public ProductResponse  getProductById(@PathVariable Long id) {
    Product product = repository.findById(id)
    .orElseThrow(() -> new RuntimeException("Product not found"));
      return ProductMapper.mapToDto(product);
  }

  // Create Product
  @PostMapping(consumes = "multipart/form-data")
  public Product createProduct(
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("price") Double price,
        @RequestParam("categoryId") Long categoryId,
        @RequestParam("images") List<MultipartFile> files)
  {
      try {
        String folder = uploadDir + "/products";
        Path uploadPath = Paths.get(folder);
        if (!Files.exists(uploadPath)) {
          Files.createDirectories(uploadPath);
        }

        // create product first
        Product newProduct = new Product();
        newProduct.setTitle(title);
        newProduct.setDescription(description);
        newProduct.setPrice(price);

        Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new RuntimeException("Category not found"));

        newProduct.setCategory(category);

        Product savedProduct = repository.save(newProduct);

        // save images
        List<ProductImage> imageList = new ArrayList<>();

        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

            ProductImage image = new ProductImage();
            image.setImagePath(fileName);
            image.setProduct(savedProduct);

            imageList.add(image);
        }

        imageRepository.saveAll(imageList);

        savedProduct.setImages(imageList);

        return savedProduct;


      } catch(Exception e) {
        throw new RuntimeException(e);
      }
  }

  
  @PutMapping(value = "/{id}", consumes = "multipart/form-data")
  public Product updateProduct(
    @PathVariable Long id,
    @RequestParam("title") String title,
    @RequestParam("description") String description,
    @RequestParam("price") Double price,
    @RequestParam("categoryId") Long categoryId,
    @RequestParam(value = "images", required = false) List<MultipartFile> files
  ) throws IOException {
    Product existing = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found"));

    existing.setTitle(title);
    existing.setDescription(description);
    existing.setPrice(price);

    Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new RuntimeException("Category not found"));

    existing.setCategory(category);

    String folder = uploadDir + "/products";
    Path uploadPath = Paths.get(folder);

    if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
    }

    // Add Images If Exist
    if (files != null && !files.isEmpty()) {
      List<ProductImage> newImages = new ArrayList<>();

      for (MultipartFile file : files) {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

        ProductImage image = new ProductImage();
        image.setImagePath(fileName);
        image.setProduct(existing);

        newImages.add(image);
      }

      imageRepository.saveAll(newImages);

      existing.getImages().addAll(newImages);
    }

    return repository.save(existing);
  }


  @DeleteMapping("/{id}")
  public void deleteProduct(@PathVariable Long id) {
    if (!repository.existsById(id)) {
      throw new RuntimeException("Product not found");
  }
    repository.deleteById(id);
  }
  
  
  
}
