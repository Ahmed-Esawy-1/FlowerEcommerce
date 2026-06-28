package com.ahmedesawy.flow.category;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ahmedesawy.flow.category.dto.CategoryResponse;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@Validated
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

   private final CategoryService categoryService;


   // --- QUIRES -----------------------------------------------------------------------

   @GetMapping
      public List<CategoryResponse> getActiveCategories() {
      return categoryService.getCategories();
   }

   @GetMapping("/trash")
      public List<CategoryResponse> getTrashCategories() {
      return categoryService.getTrashCategories();
   }

   @GetMapping("{id}")
   public CategoryResponse getCategoryById(@PathVariable Long id) {
      return categoryService.getCategoryById(id);
   }

   // -- CREATE ----------------------------------------------------------------------------------

   @PostMapping(consumes = "multipart/form-data")
   public CategoryResponse createCategory(
      @RequestParam @NotBlank(message = "Category english name  is required") String nameEn,
      @RequestParam @NotBlank(message = "Category arabic name is required") String nameAr,
      @RequestParam(value = "image", required = false) MultipartFile file
   ) {
      return categoryService.create(nameEn, nameAr, file);
   }

   // -- UPDATE ----------------------------------------------------------------------------------

   @PutMapping(value = "{id}", consumes = "multipart/form-data")
   public CategoryResponse updateCategory(
      @PathVariable Long id,
      @RequestParam(required = false) String nameEn,
      @RequestParam(required = false) String nameAr,
      @RequestParam(value = "image", required = false) MultipartFile file
   ) {
      return categoryService.update(id, nameEn, nameAr, file);
   }

   // -- SINGLE OPERATIONS  --------------------------------------------------------------------------------------

   @PatchMapping("/{id}/restore")
   public void restore(@PathVariable Long id) {
      categoryService.restore(id);
   }

   @DeleteMapping("/{id}")
   public void softDelete(@PathVariable Long id) {
      categoryService.softDelete(id);
   }


   @DeleteMapping("/{id}/permanent")
   public void permanentlyDelete(@PathVariable Long id) {
      categoryService.hardDelete(id);
   }

   // -- BULK OPERATIONS  --------------------------------------------------------------------------------------

   @PatchMapping("/restore/bulk")
   public void restoreMany(@RequestBody List<Long> ids) {
      categoryService.restoreBulk(ids);
   }

   @DeleteMapping("/permanent/bulk")
   public void permanentlyDeleteBulk(@RequestBody List<Long> ids) {
      categoryService.hardDeleteBulk(ids);
   }

}
