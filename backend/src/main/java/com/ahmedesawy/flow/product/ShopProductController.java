package com.ahmedesawy.flow.product;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.flow.product.dto.request.ProductFilterRequest;
import com.ahmedesawy.flow.product.dto.response.ProductPriceRangeResponse;
import com.ahmedesawy.flow.product.dto.response.ProductResponse;
import com.ahmedesawy.flow.product.dto.response.ProductSummaryResponse;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/shop/products")
@RequiredArgsConstructor
public class ShopProductController {

   private final ProductService productService;

   @GetMapping
   public Page<ProductSummaryResponse> getProducts(
      @ModelAttribute ProductFilterRequest request,
      Pageable pageable
   ) {
      return productService.getProducts(request, pageable)
            .map(ProductMapper::toSummaryResponse);
   }

   @GetMapping("/{id}")
   public ProductResponse getProductById(@PathVariable Long id) {
      return productService.getActiveProductById(id);
   }

   @GetMapping("/price-range")
   public ProductPriceRangeResponse getPriceRange() {
      return productService.getPriceRange();
   }

   @GetMapping("/best-sellers")
   public List<ProductSummaryResponse> getBestSellers() {
      return productService.getBestSellers();
   }

   @GetMapping("/by-occasion/{occasionId}")
   public List<ProductSummaryResponse> getByOccasion(@PathVariable Long occasionId) {
      return productService.getProductsByOccasion(occasionId);
   }

   @GetMapping("/by-occasion")
   public List<ProductSummaryResponse> getByOccasionName(@RequestParam String name) {
      return productService.getProductsByOccasionName(name);
   }
}
