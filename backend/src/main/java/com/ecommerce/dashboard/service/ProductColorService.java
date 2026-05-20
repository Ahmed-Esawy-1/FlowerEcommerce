package com.ecommerce.dashboard.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.product.AddProductColorRequest;
import com.ecommerce.dashboard.dto.response.product.ProductColorImageResponse;
import com.ecommerce.dashboard.dto.response.product.ProductResponse;
import com.ecommerce.dashboard.exception.NotFoundException;
import com.ecommerce.dashboard.mapper.ProductMapper;
import com.ecommerce.dashboard.model.Product;
import com.ecommerce.dashboard.model.ProductColor;
import com.ecommerce.dashboard.model.ProductColorImage;
import com.ecommerce.dashboard.repository.ProductColorImageRepository;
import com.ecommerce.dashboard.repository.ProductColorRepository;
import com.ecommerce.dashboard.repository.ProductRepository;

import jakarta.transaction.Transactional;

public class ProductColorService {

   private final ProductColorRepository productColorRepository;   
   private final ProductRepository productRepository;
   private final FileStorageService fileStorageService;
   private final ProductColorImageRepository productColorImageRepository;


   
   public ProductColorService(
      ProductColorRepository productColorRepository, 
      ProductRepository productRepository,
      FileStorageService fileStorageService,
      ProductColorImageRepository productColorImageRepository
   ) {
      this.productColorRepository = productColorRepository;
      this.productRepository = productRepository;
      this.fileStorageService = fileStorageService;
      this.productColorImageRepository = productColorImageRepository;
   }



   // Get images for a specific color of a product
   public List<ProductColorImageResponse> getColorImages(Long productId, Long colorId) {

      productRepository.findById(productId)
            .orElseThrow(() -> new NotFoundException("Product Not Found"));

      ProductColor color = productColorRepository.findById(colorId)
            .orElseThrow(() -> new NotFoundException("Color Not Found"));

      // color belongs to this product
      if (!color.getProduct().getId().equals(productId)) {
         throw new NotFoundException("Color does not belong to this product");
      }

      if (color.getImages() == null) return List.of();

      return color.getImages()
            .stream()
            .sorted(Comparator.comparingInt(ProductColorImage::getSortOrder))
            .map(img -> {
               ProductColorImageResponse r = new ProductColorImageResponse();
               r.setId(img.getId());
               r.setSortOrder(img.getSortOrder());
               r.setImageUrl(img.getImageUrl() != null
                     ? "/api/upload_images/products/" + img.getImageUrl()
                     : null);
               return r;
            })
            .toList();
   }

   // Add a color with images to a product
   @Transactional
   public ProductResponse addColor(Long productId, AddProductColorRequest req, List<MultipartFile> files) {
      Product product = productRepository.findById(productId)
            .orElseThrow(() -> new NotFoundException("Product Not Found"));

      ProductColor color = new ProductColor();
      color.setName(req.getName());
      color.setHexCode(req.getHexCode());
      color.setProduct(product);
      ProductColor savedColor = productColorRepository.save(color);


      if (files != null && !files.isEmpty()) {

         List<ProductColorImage> colorImages = new ArrayList<>();
         int order = 0;

         for (MultipartFile file : files) {

            if (file == null || file.isEmpty()) continue;

            ProductColorImage img = new ProductColorImage();
            img.setImageUrl(fileStorageService.uploadImage(file, "products"));
            img.setSortOrder(order++);
            img.setProductColor(savedColor);

            colorImages.add(img);
         }

         productColorImageRepository.saveAll(colorImages);
         savedColor.setImages(colorImages);
      }

      // reload to get New data
      Product updated = productRepository.findById(productId)
            .orElseThrow(() -> new NotFoundException("Product Not Found"));

      return ProductMapper.toResponse(updated);
   }

   // Delete a color and its images
   @Transactional
   public void deleteColor(Long colorId) {
      ProductColor color = productColorRepository.findById(colorId)
            .orElseThrow(() -> new NotFoundException("Color Not Found"));

      // delete image files 
      if (color.getImages() != null) {
         color.getImages().forEach(img ->
               fileStorageService.deleteFile("products/" + img.getImageUrl())
         );
      }

      productColorRepository.delete(color);
   }


   // Delete a single color image
   @Transactional
   public void deleteColorImage(Long imageId) {
      ProductColorImage img = productColorImageRepository.findById(imageId)
            .orElseThrow(() -> new NotFoundException("Image Not Found"));
            
      fileStorageService.deleteFile("products/" + img.getImageUrl());
      productColorImageRepository.delete(img);
   }

}
