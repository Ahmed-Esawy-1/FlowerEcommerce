package com.ahmedesawy.flow.section;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.flow.product.dto.response.ProductResponse;
import com.ahmedesawy.flow.section.dto.request.SectionProductRequest;
import com.ahmedesawy.flow.section.dto.request.SectionRequest;
import com.ahmedesawy.flow.section.dto.response.SectionProductResponse;
import com.ahmedesawy.flow.section.dto.response.SectionResponse;
import com.ahmedesawy.flow.section.dto.response.SectionSummaryResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sections")
@RequiredArgsConstructor
public class SectionController {

   private final SectionService sectionService;

   // ---- QUIRES ----------------------------------------------------------------------

   @GetMapping
   public List<SectionResponse> getSections() {
      return sectionService.getSections();
   }

   @GetMapping("/{id}/products")
   public List<ProductResponse> getSectionProducts(@PathVariable Long id) {
      return sectionService.getSectionProducts(id);
   }

   // ─── Admin/dashboard endpoints (unchanged) ─────────────────────────────────

   // @PostMapping
   // public ResponseEntity<SectionResponse> create(@RequestBody SectionRequest req) {
   //    return ResponseEntity.status(201).body(sectionService.createSection(req));
   // }


   // @PutMapping("/{id}")
   // public SectionResponse update(@PathVariable Long id, @RequestBody SectionRequest req) {
   //    return sectionService.updateSection(id, req);
   // }

   // @DeleteMapping("/{id}")
   // public ResponseEntity<Void> delete(@PathVariable Long id) {
   //    sectionService.deleteSection(id);
   //    return ResponseEntity.noContent().build();
   // }

   // @PostMapping("/{sectionId}/products")
   // public ResponseEntity<SectionProductResponse> addProduct(
   //    @PathVariable Long sectionId,
   //    @RequestBody SectionProductRequest req
   // ) {
   //    return ResponseEntity.status(201).body(sectionService.addProduct(sectionId, req));
   // }

   // @DeleteMapping("/{sectionId}/products/{productId}")
   // public ResponseEntity<Void> removeProduct(
   //    @PathVariable Long sectionId,
   //    @PathVariable Long productId
   // ) {
   //    sectionService.removeProduct(sectionId, productId);
   //    return ResponseEntity.noContent().build();
   // }
}