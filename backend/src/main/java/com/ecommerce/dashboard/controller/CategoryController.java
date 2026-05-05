package com.ecommerce.dashboard.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.model.Category;
import com.ecommerce.dashboard.repository.CategoryRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;





@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    CategoryRepository categoryRepo;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Get All Categories
    @GetMapping
    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }

    // Create New Category
    @PostMapping
    public Category createCategory(
        @RequestParam String name,
        @RequestParam(value = "image", required = false) MultipartFile file
    ) {

        Category newCategory = new Category();
        newCategory.setName(name);

        if (file != null && !file.isEmpty()) {
            String imagePath = uploadCategoryImage(file);
            newCategory.setImagePath(imagePath);
        }
        
        return categoryRepo.save(newCategory);
    }
    
    @PutMapping("/{id}")
    public Category updateCategory(
        @PathVariable Long id,
        @RequestParam String name,
        @RequestParam(value = "image", required = false) MultipartFile file
    ) {
        
        Category existing = categoryRepo.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));

        Category newCategory = new Category();
        newCategory.setName(name);

        existing.setName(newCategory.getName());

        if (file != null && !file.isEmpty()) {
            if(existing.getImagePath() != null) {
                try {
                    Path oldPath = Paths.get(uploadDir + "/" + existing.getImagePath());
                    System.out.println(oldPath);
                    Files.deleteIfExists(oldPath);
                } catch (Exception e) {}
            }

            String imagePath = uploadCategoryImage(file);
            existing.setImagePath(imagePath);
        }
        
        return categoryRepo.save(existing);
    }

    // Delete Category
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryRepo.deleteById(id);
    }


    
    public String uploadCategoryImage(MultipartFile file) {
        try {
            String folder = uploadDir + "/categories";
            Path uploadPath = Paths.get(folder);

            if(!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

            return "categories\\" + fileName;

        } catch(Exception e) {
            throw new RuntimeException();
        }
    }

}
