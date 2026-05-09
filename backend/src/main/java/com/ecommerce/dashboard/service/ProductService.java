package com.ecommerce.dashboard.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.response.ProductResponse;
import com.ecommerce.dashboard.mapper.ProductMapper;
import com.ecommerce.dashboard.model.Category;
import com.ecommerce.dashboard.model.Product;
import com.ecommerce.dashboard.model.ProductImage;
import com.ecommerce.dashboard.repository.CategoryRepository;
import com.ecommerce.dashboard.repository.ProductImageRepository;
import com.ecommerce.dashboard.repository.ProductRepository;


@Service
public class ProductService {
  
  private final ProductRepository productRepository;
  private final ProductImageRepository productImageRepository;
  private final CategoryRepository categoryRepository;

  @Value("${file.upload-dir}")
  private String uploadDir;

  
    public ProductService(
      ProductRepository productRepository,
      ProductImageRepository productImageRepository,
      CategoryRepository categoryRepository
    ) 
    {
      this.productRepository = productRepository;
      this.productImageRepository = productImageRepository;
      this.categoryRepository = categoryRepository;
    }


  // Get All Products 
  public List<ProductResponse> getAllProducts() {
    return productRepository.findAll()
    .stream()
    .map(ProductMapper::mapToDto).toList();
  };

  // Get One Product By Id
  public ProductResponse getProduct(Long id) {
    Product product = productRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Product Not Found"));
    return ProductMapper.mapToDto(product);
  }

  // Create Product
  public Product create(
    String title,
    String description,
    Double price,
    Long categoryId,
    List<MultipartFile> files
  ) {
    Product newProduct = new Product();
    newProduct.setTitle(title);
    newProduct.setDescription(description);
    newProduct.setPrice(price);

    if(categoryId != null) {
      Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new RuntimeException("Category Not Found"));
      newProduct.setCategory(category);
    }

    Product savedProduct = productRepository.save(newProduct);

    List<ProductImage> imageList = new ArrayList<>();
    if(files != null && !files.isEmpty()) {
      for(MultipartFile img: files) {
        ProductImage image = new ProductImage();
        image.setUrl(uploadImage(img));
        image.setProduct(savedProduct);
        imageList.add(image);
      }

      productImageRepository.saveAll(imageList);
      savedProduct.setImages(imageList);
    }

    return savedProduct;
  }


  // Update Product
  public Product update(
    Long id,
    String title,
    String description,
    Double price,
    Long categoryId,
    List<MultipartFile> files,
    List<Long> removedImagesIds
  ) 
  {
    Product product = productRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Product Not Found"));
    product.setTitle(title);
    product.setDescription(description);
    product.setPrice(price);

    if(categoryId != null) {
      Category category = categoryRepository.findById(categoryId)
          .orElseThrow(() -> new RuntimeException("Category Not Found"));
      
      product.setCategory(category);
    }
    

    if(removedImagesIds != null && !removedImagesIds.isEmpty()) {
      var imagesToDelete = productImageRepository.findAllById(removedImagesIds);
      for(var img: imagesToDelete) {
        try {
          Path path = Paths.get(uploadDir, img.getUrl());
          Files.deleteIfExists(path);
        } catch (Exception e) {
          throw new RuntimeException("Failed to delete image: " + img.getUrl());
        }
      productImageRepository.deleteAll(imagesToDelete);
      }
    }

    List<ProductImage> finalImages = new ArrayList<>();
    if(files != null && !files.isEmpty()) {
      for(MultipartFile img: files) {
        ProductImage image = new ProductImage();
        image.setUrl(uploadImage(img));
        image.setProduct(product);
        finalImages.add(image);
      }
    }

    productImageRepository.saveAll(finalImages);
    product.setImages(finalImages);

    return productRepository.save(product);
  }


  // Delete Product
  public void delete(Long id) {
    if (!productRepository.existsById(id)) {
      throw new RuntimeException("Product not found");
    }
    productRepository.deleteById(id);
  }


  // Upload image
  public String uploadImage(MultipartFile image){
    try {
      String folder = uploadDir + "/products";
      Path uploadPath = Paths.get(folder);

      if(!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

      String newImageName = UUID.randomUUID() + "_" + image.getOriginalFilename();
      Files.copy(image.getInputStream(), uploadPath.resolve(newImageName));
      
      return newImageName;

    } catch(Exception e) {
      throw new RuntimeException();
    }
  }

}
