package com.ecommerce.dashboard.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.dto.request.CategoryRequest;
import com.ecommerce.dashboard.dto.response.CategoryResponse;
import com.ecommerce.dashboard.mapper.CategoryMapper;
import com.ecommerce.dashboard.model.Category;
import com.ecommerce.dashboard.repository.CategoryRepository;

@Service
public class CategoryService {
  private final CategoryRepository categoryRepository;

  @Value("${file.upload-dir}")
  private String uploadDir;

  public CategoryService(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
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
      .orElseThrow(() -> new RuntimeException("Category Not Found"));

    return CategoryMapper.mapToDto(existing);
  }

  // Create Category
  public CategoryResponse createCategory(CategoryRequest request, MultipartFile file) 
  {
    Category newCategory = new Category();
    newCategory.setName(request.getName());

    if (file != null && !file.isEmpty()) {
      newCategory.setImageUrl(uploadImage(file));
    } else {
      newCategory.setImageUrl(null);
    }

    Category saved = categoryRepository.save(newCategory);

    return CategoryMapper.mapToDto(saved);
  }

  // Update Category
  public CategoryResponse updateCategory(Long id, CategoryRequest request, MultipartFile file) 
  {

    Category existing = categoryRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Category not found"));

    existing.setName(request.getName());

    if (file != null && !file.isEmpty()) {

      if(existing.getImageUrl() != null) {
        try {
          Path oldPath = Paths.get(uploadDir, "categories", existing.getImageUrl());
          Files.deleteIfExists(oldPath);
        } catch (Exception e) {}
      }

      String imageUrl = uploadImage(file);
      existing.setImageUrl(imageUrl);
    }

    return CategoryMapper.mapToDto(categoryRepository.save(existing));
  }

  // Delete Category
  public void deleteById(Long id) {
    if (!categoryRepository.existsById(id)) {
      throw new RuntimeException("Product not found");
    }
    categoryRepository.deleteById(id);
  }


  // Upload Image
  public String uploadImage(MultipartFile file) {
    try {
      if (file == null || file.isEmpty()) {
        return null;
      }
      String folder = uploadDir + "/categories";
      Path uploadPath = Paths.get(folder);

      if(!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

      String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
      Files.copy(file.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

      return fileName;

    } catch(Exception e) {
      throw new RuntimeException();
    }
    }

}
