package com.ecommerce.dashboard.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.CategoryRequest;
import com.ecommerce.dashboard.dto.response.CategoryResponse;
import com.ecommerce.dashboard.mapper.CategoryMapper;
import com.ecommerce.dashboard.model.Category;
import com.ecommerce.dashboard.repository.CategoryRepository;
import com.ecommerce.dashboard.service.CategoryService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;





@RestController
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
    @PostMapping
    public CategoryResponse createCategory(
      @Valid @ModelAttribute CategoryRequest request,
      @RequestParam(value = "image", required = false) MultipartFile file
    ) {
      return categoryService.createCategory(request, file);
    }
    
    // Update Category
    @PutMapping("/{id}")
    public CategoryResponse updateCategory(
        @PathVariable Long id,
        @Valid @ModelAttribute CategoryRequest request,
        @RequestParam(value = "image", required = false) MultipartFile file
    ) {
        return categoryService.updateCategory(id, request, file);
    }

    // Delete Category
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
    }

}
