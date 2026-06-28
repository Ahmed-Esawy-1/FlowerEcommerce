package com.ahmedesawy.flow.product;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

import com.ahmedesawy.flow.category.dto.CategorySimpleResponse;
import com.ahmedesawy.flow.occasion.dto.OccasionSimpleResponse;
import com.ahmedesawy.flow.product.color.ProductColor;
import com.ahmedesawy.flow.product.dto.response.ProductColorImageResponse;
import com.ahmedesawy.flow.product.dto.response.ProductColorResponse;
import com.ahmedesawy.flow.product.dto.response.ProductImageResponse;
import com.ahmedesawy.flow.product.dto.response.ProductResponse;
import com.ahmedesawy.flow.product.dto.response.ProductSummaryResponse;
import com.ahmedesawy.flow.product.image.ProductColorImage;
import com.ahmedesawy.flow.product.image.ProductImage;


public class ProductMapper {

   public static ProductResponse toResponse(Product product) {
      ProductResponse response = new ProductResponse();
      mapBasicInfo(response, product);
      response.setHasColor(product.getHasColor());

      if (Boolean.TRUE.equals(product.getHasColor())) {
         response.setProductColors(
               safeStream(product.getProductColors())
                     .filter(c -> c.getDeletedAt() == null)
                     .map(ProductMapper::toColorResponse)
                     .toList()
         );
      } else {
         response.setImages(
               safeStream(product.getImages())
                     .map(ProductMapper::toImageResponse)
                     .toList()
         );
      }

      return response;
   }

   public static ProductSummaryResponse toSummaryResponse(Product product) {
      ProductSummaryResponse response = new ProductSummaryResponse();
      mapBasicInfo(response, product);
      return response;
   }

   // ----- Helpers --------------------------------------------------------------------

   private static void mapBasicInfo(ProductSummaryResponse response, Product product) {
      response.setId(product.getId());
      response.setTitle(product.getTitle());
      response.setPrice(product.getPrice());
      response.setDescription(product.getDescription());
      response.setPrimaryImageUrl(resolvePrimaryImage(product));

      if (product.getCategory() != null) {
         response.setCategory(new CategorySimpleResponse(
               product.getCategory().getId(),
               product.getCategory().getNameEn(),
               product.getCategory().getNameAr()
         ));
      }

      if (product.getOccasion() != null) {
         response.setOccasion(new OccasionSimpleResponse(
               product.getOccasion().getId(),
               product.getOccasion().getNameEn(),
               product.getOccasion().getNameAr()
         ));
      }
   }

   private static ProductColorResponse toColorResponse(ProductColor color) {
      ProductColorResponse res = new ProductColorResponse();
      res.setId(color.getId());
      res.setColorId(color.getColor().getId());
      res.setNameEn(color.getColor().getNameEn());
      res.setNameAr(color.getColor().getNameAr());
      res.setHexCode(color.getColor().getHexCode());
      res.setImages(
         safeStream(color.getImages())
               .map(ProductMapper::toColorImageResponse)
               .toList()
      );
      return res;
   }

   private static ProductImageResponse toImageResponse(ProductImage img) {
      ProductImageResponse res = new ProductImageResponse();
      res.setId(img.getId());
      res.setImageUrl(buildImageUrl(img.getImageUrl()));
      return res;
   }

   private static ProductColorImageResponse toColorImageResponse(ProductColorImage img) {
      ProductColorImageResponse res = new ProductColorImageResponse();
      res.setId(img.getId());
      res.setSortOrder(img.getSortOrder());
      res.setImageUrl(buildImageUrl(img.getImageUrl()));
      return res;
   }


   private static String resolvePrimaryImage(Product product) {
      if (!Boolean.TRUE.equals(product.getHasColor())) {
         return safeStream(product.getImages())
                     .findFirst()
                     .map(img -> buildImageUrl(img.getImageUrl()))
                     .orElse(null);
      }

      return safeStream(product.getProductColors())
            .filter(c -> c.getDeletedAt() == null)
            .filter(c -> c.getImages() != null && !c.getImages().isEmpty())
            .findFirst()
            .flatMap(c -> c.getImages().stream()
                  .min(Comparator.comparingInt(ProductColorImage::getSortOrder)))
            .map(img -> buildImageUrl(img.getImageUrl()))
            .orElse(null);
   }

   private static String buildImageUrl(String filename) {
      return filename != null ? "/api/upload_images/products/" + filename : null;
   }

   private static <T> Stream<T> safeStream(List<T> list) {
      return list != null ? list.stream() : Stream.empty();
   }
}