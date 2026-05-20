package com.ecommerce.dashboard.service;


import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.response.category.CategoryResponse;
import com.ecommerce.dashboard.exception.BadRequestException;
import com.ecommerce.dashboard.exception.NotFoundException;
import com.ecommerce.dashboard.mapper.CategoryMapper;
import com.ecommerce.dashboard.model.Category;
import com.ecommerce.dashboard.repository.CategoryRepository;

@Service
public class CategoryService {
   private final CategoryRepository categoryRepository;
   private final FileStorageService fileStorageService;

   public CategoryService(CategoryRepository categoryRepository ,FileStorageService fileStorageService) {
      this.categoryRepository = categoryRepository;
      this.fileStorageService = fileStorageService;
   }

  // Get All Categories
   public List<CategoryResponse> getAllCategories() {
      return categoryRepository.findAll()
            .stream()
            .map(CategoryMapper::mapToDto)
            .toList();
   }   

  // Get Category By Id
   public CategoryResponse getCategoryById(Long id) {
      Category existing = categoryRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Category Not Found"));

      return CategoryMapper.mapToDto(existing);
   }

   // Create Category
   public CategoryResponse createCategory(String name, MultipartFile file) {
      Category newCategory = new Category();

      if (name != null && !name.isEmpty()) {
         if (categoryRepository.existsByName(name)) {
            throw new BadRequestException("This name is alerady exist");
         }
         newCategory.setName(name);
      }

      if (file != null && !file.isEmpty()) {
         if (categoryRepository.existsByName(name)) {
            throw new BadRequestException("This name is alerady exist");
         }
         newCategory.setImageUrl(fileStorageService.uploadImage(file, "categories"));
      } else {
         newCategory.setImageUrl(null);
      }

      Category saved = categoryRepository.save(newCategory);

      return CategoryMapper.mapToDto(saved);
   }

  // Update Category
   public CategoryResponse updateCategory(Long id, String name, MultipartFile file) {

      Category existing = categoryRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Category not found"));

      // Update Name
      if (name != null && !name.trim().isEmpty()) {

         if (!existing.getName().equals(name)) {

            if (categoryRepository.existsByName(name)) {
               throw new BadRequestException("This name is alerady exist");
            }

            existing.setName(name);
         }
      }

      // Update Image
      if (file != null && !file.isEmpty()) {

         if (existing.getImageUrl() != null) {
            try {
               fileStorageService.deleteFile(
                  "categories/" + existing.getImageUrl()
               );
            } catch (Exception e) {}
         }

         existing.setImageUrl(
            fileStorageService.uploadImage(file, "categories")
         );
      }
      Category saved = categoryRepository.save(existing);
      return CategoryMapper.mapToDto(saved);
   }

   // Delete Category
   public void deleteById(Long id) {
      Category existing = categoryRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Category Not Found"));

      if (existing.getImageUrl() != null) {
         try {
            fileStorageService.deleteFile("categories/" + existing.getImageUrl());
         } catch (Exception e) {}
      }
      categoryRepository.delete(existing);
   }



}
