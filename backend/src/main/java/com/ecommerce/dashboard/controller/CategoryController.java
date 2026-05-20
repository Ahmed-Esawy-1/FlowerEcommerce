package com.ecommerce.dashboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.response.category.CategoryResponse;
import com.ecommerce.dashboard.service.CategoryService;


import jakarta.validation.constraints.NotBlank;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@Validated
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Get All Categories
    @GetMapping
    public List<CategoryResponse> getCategories() {
      return categoryService.getAllCategories();
    }

    // Get Category By Id
    @GetMapping("{id}")
    public CategoryResponse getCategoryById(@PathVariable Long id) {
      return categoryService.getCategoryById(id);
    }

    // Create New Category
    @PostMapping(consumes = "multipart/form-data")
    public CategoryResponse createCategory(
      @RequestParam @NotBlank(message = "Category name is required") String name,
      @RequestParam(value = "image", required = false) MultipartFile file
    ) {
      return categoryService.createCategory(name, file);
    }
    
    // Update Category
    @PutMapping(value = "{id}", consumes = "multipart/form-data")
    public CategoryResponse updateCategory(
      @PathVariable Long id,
      @RequestParam(required = false) String name,
      @RequestParam(value = "image", required = false) MultipartFile file
    ) {
      return categoryService.updateCategory(id, name, file);
    }

    // Delete Category
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
      categoryService.deleteById(id);
    }

}
