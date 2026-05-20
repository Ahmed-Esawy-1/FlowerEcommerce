package com.ecommerce.dashboard.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.product.AddProductColorRequest;
import com.ecommerce.dashboard.dto.request.product.CreateProductRequest;
import com.ecommerce.dashboard.dto.request.product.UpdateProductRequest;
import com.ecommerce.dashboard.dto.response.product.ProductColorImageResponse;
import com.ecommerce.dashboard.dto.response.product.ProductResponse;
import com.ecommerce.dashboard.exception.FileOperationException;
import com.ecommerce.dashboard.exception.NotFoundException;
import com.ecommerce.dashboard.mapper.ProductMapper;
import com.ecommerce.dashboard.model.Category;
import com.ecommerce.dashboard.model.Occasion;
import com.ecommerce.dashboard.model.Product;
import com.ecommerce.dashboard.model.ProductColor;
import com.ecommerce.dashboard.model.ProductColorImage;
import com.ecommerce.dashboard.model.ProductImage;
import com.ecommerce.dashboard.repository.CategoryRepository;
import com.ecommerce.dashboard.repository.OccasionRepository;
import com.ecommerce.dashboard.repository.ProductColorImageRepository;
import com.ecommerce.dashboard.repository.ProductColorRepository;
import com.ecommerce.dashboard.repository.ProductImageRepository;
import com.ecommerce.dashboard.repository.ProductRepository;


@Service
public class ProductService {

   private final ProductRepository productRepository;
   private final ProductImageRepository productImageRepository;
   private final CategoryRepository categoryRepository;
   private final OccasionRepository occasionRepository;
   private final FileStorageService fileStorageService;
   private final ProductColorRepository productColorRepository;
   private final ProductColorImageRepository productColorImageRepository;

   @Value("${file.upload-dir}")
   private String uploadDir;


   public ProductService(
      ProductRepository productRepository,
      ProductImageRepository productImageRepository,
      CategoryRepository categoryRepository,
      OccasionRepository occasionRepository,
      FileStorageService fileStorageService,
      ProductColorRepository productColorRepository,          
      ProductColorImageRepository productColorImageRepository 
   ) {
      this.productRepository = productRepository;
      this.productImageRepository = productImageRepository;
      this.categoryRepository = categoryRepository;
      this.occasionRepository = occasionRepository;
      this.fileStorageService = fileStorageService;
      this.productColorRepository = productColorRepository;           
      this.productColorImageRepository = productColorImageRepository; 
   }


   // Get All Products 
   public List<ProductResponse> getAllProducts() {
      return productRepository.findAll()
            .stream()
            .map(ProductMapper::toResponse)
            .toList();
   };

   // Get One Product By Id
   public ProductResponse getProduct(Long id) {
      Product product = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product Not Found"));
      return ProductMapper.toResponse(product);
   }

   // Get Products by occasion id
   public List<ProductResponse> getByOccasionId(Long occasionId) {
      return productRepository.findByOccasionId(occasionId)
            .stream()
            .map(ProductMapper::toResponse)
            .toList();
   }

   // Get Products by occasion name
   public List<ProductResponse> getByOccasionName(String name) {
      return productRepository.findByOccasionName(name)
            .stream()
            .map(ProductMapper::toResponse)
            .toList();
   }
   // Best Seller
   public List<ProductResponse> getBestSellers() {
      return productRepository.findBestSellers()
            .stream()
            .map(ProductMapper::toResponse)
            .toList();
   }

   // Create Product
   @Transactional
   public ProductResponse create(CreateProductRequest req, List<MultipartFile> files) {

      Product newProduct = new Product();
      newProduct.setTitle(req.getTitle());
      newProduct.setDescription(req.getDescription());
      newProduct.setPrice(req.getPrice());

      if(req.getCategoryId() != null) {
         Category category = categoryRepository.findById(req.getCategoryId())
               .orElseThrow(() -> new NotFoundException("Category Not Found"));
         newProduct.setCategory(category);
      }

      if(req.getOccasionId() != null) {
         Occasion occasion = occasionRepository.findById(req.getOccasionId())
               .orElseThrow(() -> new NotFoundException("Category Not Found"));
         newProduct.setOccasion(occasion);
      }


      Product savedProduct = productRepository.save(newProduct);

      List<ProductImage> imageList = new ArrayList<>();
      if(files != null && !files.isEmpty()) {
         for(MultipartFile img: files) {

            if(img == null || img.isEmpty()) {
               continue;
            }

            ProductImage image = new ProductImage();
            image.setImageUrl(fileStorageService.uploadImage(img, "products"));
            image.setProduct(savedProduct);
            imageList.add(image);
         }

         if(!imageList.isEmpty()) {
            productImageRepository.saveAll(imageList);
            savedProduct.setImages(imageList);
         }
      
      }

      return ProductMapper.toResponse(savedProduct);
   }


   // Update Product
   @Transactional
   public ProductResponse update(Long id, UpdateProductRequest req, List<MultipartFile> files) {
      Product product = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product Not Found"));

      if(req.getTitle() != null && !req.getTitle().isBlank()) {
         product.setTitle(req.getTitle());
      }
         
      if(req.getDescription() != null && !req.getDescription().isBlank()) {
         product.setDescription(req.getDescription());
      }
         
      if(req.getPrice() != null) {
         product.setPrice(req.getPrice());
      }
      
      if(req.getCategoryId() != null) {
         Category category = categoryRepository.findById(req.getCategoryId())
               .orElseThrow(() -> new NotFoundException("Category Not Found"));
         product.setCategory(category);
      }

      if(req.getOccasionId() != null) {
         Occasion occasion = occasionRepository.findById(req.getOccasionId())
               .orElseThrow(() -> new NotFoundException("Category Not Found"));
         product.setOccasion(occasion);
      }

   
      // Remove Product Images
      if(req.getRemovedImageIds() != null && !req.getRemovedImageIds().isEmpty()) {
         
         List<ProductImage> imagesToDelete = productImageRepository.findAllById(req.getRemovedImageIds());
         for(ProductImage  img: imagesToDelete) {
            try {
               fileStorageService.deleteFile("products/" + img.getImageUrl());
            } catch (Exception e) {
               throw new FileOperationException("Failed to delete image: " + img.getImageUrl());
            }
         }
         product.getImages().removeAll(imagesToDelete);
         productImageRepository.deleteAll(imagesToDelete);
      }


      // Add New Images For Product
      if(files != null && !files.isEmpty()) {
         List<ProductImage> finalImages = new ArrayList<>();

         for(MultipartFile img: files) {

            if(img == null || img.isEmpty()) {
               continue;
            }

            ProductImage image = new ProductImage();
            image.setImageUrl(fileStorageService.uploadImage(img, "products"));
            image.setProduct(product);

            finalImages.add(image);
         }

         productImageRepository.saveAll(finalImages);
         product.getImages().addAll(finalImages);
      }

      Product saved = productRepository.save(product);

      return ProductMapper.toResponse(saved);
   }


   // Delete Product
   public void deleteProduct(Long id) {

      Product existing = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product Not Found"));

      if (existing.getImages() != null) {
         existing.getImages().forEach(image -> {
            fileStorageService.deleteFile("products/" + image.getImageUrl());
         });
      }

      // delete color images
      if (existing.getColors() != null) {

         existing.getColors().forEach(color -> {
            if (color.getImages() != null) {
                  color.getImages().forEach(img ->
                     fileStorageService.deleteFile("products/" + img.getImageUrl())
                  );
            }
         });

      }


      productRepository.delete(existing);
   }


}
