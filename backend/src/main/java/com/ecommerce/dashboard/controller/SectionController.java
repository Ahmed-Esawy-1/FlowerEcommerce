package com.ecommerce.dashboard.controller;

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

import com.ecommerce.dashboard.dto.request.section.SectionProductRequest;
import com.ecommerce.dashboard.dto.request.section.SectionRequest;
import com.ecommerce.dashboard.dto.response.section.SectionProductResponse;
import com.ecommerce.dashboard.dto.response.section.SectionResponse;
import com.ecommerce.dashboard.service.SectionService;

@RestController
@RequestMapping("/sections")
public class SectionController {

   private final SectionService sectionService;


   public SectionController(SectionService sectionService) {
      this.sectionService = sectionService;
   }

   @PostMapping
   public ResponseEntity<SectionResponse> create(@RequestBody SectionRequest req) {
      return ResponseEntity.status(201).body(sectionService.createSection(req));
   }

   @GetMapping
   public List<SectionResponse> getAll() {
      return sectionService.getAllSections();
   }

   @PutMapping("/{id}")
   public SectionResponse update(@PathVariable Long id, @RequestBody SectionRequest req) {
      return sectionService.updateSection(id, req);
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<Void> delete(@PathVariable Long id) {
      sectionService.deleteSection(id);
      return ResponseEntity.noContent().build();
   }

   @PostMapping("/{sectionId}/products")
   public ResponseEntity<SectionProductResponse> addProduct(
      @PathVariable Long sectionId,
      @RequestBody SectionProductRequest req
   ) {
      return ResponseEntity.status(201).body(sectionService.addProduct(sectionId, req));
   }

   @DeleteMapping("/{sectionId}/products/{productId}")
   public ResponseEntity<Void> removeProduct(
      @PathVariable Long sectionId,
      @PathVariable Long productId
   ) {
      sectionService.removeProduct(sectionId, productId);
      return ResponseEntity.noContent().build();
   }
}
