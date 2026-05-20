package com.ecommerce.dashboard.mapper;

import com.ecommerce.dashboard.dto.response.category.CategorySimpleResponse;
import com.ecommerce.dashboard.dto.response.occasion.OccasionSimpleResponse;
import com.ecommerce.dashboard.dto.response.product.ProductColorImageResponse;
import com.ecommerce.dashboard.dto.response.product.ProductColorResponse;
import com.ecommerce.dashboard.dto.response.product.ProductImageResponse;
import com.ecommerce.dashboard.dto.response.product.ProductResponse;
import com.ecommerce.dashboard.model.Product;
import com.ecommerce.dashboard.model.ProductColor;
import com.ecommerce.dashboard.model.ProductColorImage;

import java.util.Comparator;
import java.util.List;

public class ProductMapper {

   public static ProductResponse toResponse(Product product) {

      ProductResponse response = new ProductResponse();

      response.setId(product.getId());
      response.setTitle(product.getTitle());
      response.setPrice(product.getPrice());
      response.setDescription(product.getDescription());

      // Category
      CategorySimpleResponse cat = null;
      if (product.getCategory() != null) {
         cat = new CategorySimpleResponse();
         cat.setId(product.getCategory().getId());
         cat.setName(product.getCategory().getName());
      }
      response.setCategory(cat);

      // Occasion
      OccasionSimpleResponse occasion = null;
      if (product.getOccasion() != null) {
         occasion = new OccasionSimpleResponse();
         occasion.setId(product.getOccasion().getId());
         occasion.setName(product.getOccasion().getName());
      }
      response.setOccasion(occasion);

      // General images
      if (product.getImages() != null) {
         List<ProductImageResponse> images = product.getImages()
               .stream()
               .map(img -> {
                  ProductImageResponse r = new ProductImageResponse();
                  r.setId(img.getId());
                  r.setImageUrl(img.getImageUrl() != null
                        ? "/api/upload_images/products/" + img.getImageUrl()
                        : null);
                  return r;
               })
               .toList();
         response.setImages(images);
      }

      // Colors with their images
      if (product.getColors() != null) {
         List<ProductColorResponse> colors = product.getColors()
               .stream()
               .map(ProductMapper::toColorResponse)
               .toList();
         response.setColors(colors);
      }

      
      response.setPrimaryImageUrl(resolvePrimaryImage(product));

      return response;
   }


   // ── Helpers ────────────────────────────────────────────────────────────────

   
   private static ProductColorResponse toColorResponse(ProductColor color) {
      ProductColorResponse res = new ProductColorResponse();
      res.setId(color.getId());
      res.setName(color.getColor().getName());
      res.setHexCode(color.getColor().getHexCode());

      if (color.getImages() != null) {
         List<ProductColorImageResponse> images = color.getImages()
               .stream()
               .map(ProductMapper::toColorImageResponse)
               .toList();
         res.setImages(images);
      }
      return res;
   }

   private static ProductColorImageResponse toColorImageResponse(ProductColorImage img) {
      ProductColorImageResponse res = new ProductColorImageResponse();
      res.setId(img.getId());
      res.setSortOrder(img.getSortOrder());
      res.setImageUrl(img.getImageUrl() != null
            ? "/api/upload_images/products/" + img.getImageUrl()
            : null);
      return res;
   }


   // We Will need first Image (images or color images)
   private static String resolvePrimaryImage(Product product) {

      // images
      if (product.getImages() != null && !product.getImages().isEmpty()) {
         return "/api/upload_images/products/" + product.getImages().get(0).getImageUrl();
      }

      // color images
      if (product.getColors() != null && !product.getColors().isEmpty()) {

         ProductColor firstColor = product.getColors().get(0);

         if (firstColor.getImages() != null && !firstColor.getImages().isEmpty()) {

            ProductColorImage cover = firstColor.getImages()
                  .stream()
                  .min(Comparator.comparingInt(ProductColorImage::getSortOrder))
                  .orElse(firstColor.getImages().get(0));

            return "/api/upload_images/products/" + cover.getImageUrl();

         }
      }

      
      return null;
   }

}