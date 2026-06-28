package com.ahmedesawy.flow.product;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ahmedesawy.flow.product.dto.request.CreateProductRequest;
import com.ahmedesawy.flow.product.dto.request.FullUpdateRequest;
import com.ahmedesawy.flow.product.dto.response.ProductResponse;
import com.ahmedesawy.flow.product.dto.response.ProductSummaryResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    // ---- GET ---------------------------------------------------------------------

    @GetMapping
    public List<ProductSummaryResponse> getActiveProducts() {
        return productService.getActiveProducts();
    }

    @GetMapping("/trash")
    public List<ProductSummaryResponse> getTrashProducts() {
        return productService.getTrashProducts();
    }

    @GetMapping("/{id}")
    public ProductResponse getActiveProductById(@PathVariable Long id) {
        return productService.getActiveProductById(id);
    }

    // ---- CREATE ---------------------------------------------------------------------

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> createProduct(
        @ModelAttribute CreateProductRequest request,
        MultipartHttpServletRequest multipartRequest
    ) {
        return ResponseEntity.ok(productService.createProduct(request, multipartRequest));
    }

    // ---- FULL UPDATE ---------------------------------------------------------------------
    
    @PutMapping(value = "/{productId}/full", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> fullUpdate(
        @PathVariable Long productId,
        @ModelAttribute FullUpdateRequest request,
        @RequestParam(value = "colorsMeta", required = false) String colorsMeta,
        MultipartHttpServletRequest multipartRequest
    ) {
        return ResponseEntity.ok(
            productService.fullUpdate(productId, request, colorsMeta, multipartRequest)
        );
    }

    // ---- SINGLE OPERATIONS ---------------------------------------------------------------------

    @PatchMapping("/{id}/restore")
    public ResponseEntity<Void> restoreProduct(@PathVariable Long id) {
        productService.restore(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        productService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> hardDelete(@PathVariable Long id) {
        productService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }

    // ---- BULK OPERATIONS ---------------------------------------------------------------------

    @PatchMapping("/restore")
    public ResponseEntity<Void> restoreBulk(@RequestBody List<Long> ids) {
        productService.restoreBulk(ids);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> softDeleteBulk(@RequestBody List<Long> ids) {
        productService.softDeleteBulk(ids);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/permanent/bulk")
    public ResponseEntity<Void> hardDeleteBulk(@RequestBody List<Long> ids) {
        productService.hardDeleteBulk(ids);
        return ResponseEntity.noContent().build();
    }
}