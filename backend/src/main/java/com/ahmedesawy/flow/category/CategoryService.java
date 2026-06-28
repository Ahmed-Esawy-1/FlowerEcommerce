package com.ahmedesawy.flow.category;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ahmedesawy.flow.category.dto.CategoryResponse;
import com.ahmedesawy.flow.common.exception.NotFoundException;
import com.ahmedesawy.flow.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.flow.common.storage.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

   private final CategoryRepository categoryRepository;
   private final FileStorageService fileStorageService;


   // -- QUIRES ---------------------------------------------------------------------------------

   public List<CategoryResponse> getCategories() {
      return categoryRepository.findAllByDeletedAtIsNullOrderByUpdatedAtDesc()
            .stream()
            .map(CategoryMapper::mapToDto)
            .toList();
   }  

   public List<CategoryResponse> getTrashCategories() {
      return categoryRepository.findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc()
            .stream()
            .map(CategoryMapper::mapToDto)
            .toList();
   }  

   public CategoryResponse getCategoryById(Long id) {
      Category existing = findCategory(id);
      return CategoryMapper.mapToDto(existing);
   }

   // -- CREATE ---------------------------------------------------------------------------------
   @Transactional
   public CategoryResponse create(String nameEn, String nameAr, MultipartFile file) {
      
      if (nameEn != null && !nameEn.isEmpty()) {
         if (categoryRepository.existsByNameEn(nameEn)) {
            throw new ResourceAlreadyExistsException("This english name is alerady exist");
         }
         
      }

      if (nameAr != null && !nameAr.isEmpty()) {
         if (categoryRepository.existsByNameAr(nameAr)) {
            throw new ResourceAlreadyExistsException("This arabic name is alerady exist");
         }
         
      }
      Category newCategory = new Category();
      newCategory.setNameEn(nameEn);
      newCategory.setNameAr(nameAr);

      if (file != null && !file.isEmpty()) {
         newCategory.setImageUrl(fileStorageService.uploadImage(file, "categories"));
      } else {
         newCategory.setImageUrl(null);
      }

      return CategoryMapper.mapToDto(categoryRepository.save(newCategory));
   }

   // -- UPDATE  --------------------------------------------------------------------------------------
   @Transactional
   public CategoryResponse update(Long id, String nameEn, String nameAr, MultipartFile file) {

      Category existing = findCategory(id);

      // Update Name En
      if (nameEn != null && !nameEn.trim().isEmpty()) {

         if (!existing.getNameEn().equals(nameEn)) {

            if (categoryRepository.existsByNameEn(nameEn)) {
               throw new ResourceAlreadyExistsException("This english name is alerady exist");
            }

            existing.setNameEn(nameEn);
         }
      }

      // Update Name Ar
      if (nameAr != null && !nameAr.trim().isEmpty()) {

         if (!existing.getNameAr().equals(nameAr)) {

            if (categoryRepository.existsByNameAr(nameAr)) {
               throw new ResourceAlreadyExistsException("This arabic name is alerady exist");
            }

            existing.setNameAr(nameAr);
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

      return CategoryMapper.mapToDto(categoryRepository.save(existing));
   }

   // -- SINGLE OPERATIONS  -------------------------------------------------------------------------------------- 

   public void restore(Long id) {
      Category category = findCategory(id);
      category.setDeletedAt(null);
      categoryRepository.save(category);
   }

   public void softDelete(Long id) {
      Category existing = findCategory(id);
      existing.setDeletedAt(LocalDateTime.now());
      categoryRepository.save(existing);
   }

   public void hardDelete(Long id) {
      Category existing = findCategory(id);

      if (existing.getImageUrl() != null) {
         try {
            fileStorageService.deleteFile("categories/" + existing.getImageUrl());
         } catch (Exception e) {}
      }

      categoryRepository.delete(existing);
   }

   
   // -- BULK OPERATIONS  -------------------------------------------------------------------------------------- 

   @Transactional
   public void restoreBulk(List<Long> ids) {
      categoryRepository.restoreBulk(ids);
   }

   @Transactional
   public void hardDeleteBulk(List<Long> ids) {
      categoryRepository.deleteAllByIdInBatch(ids);
   }

   // --- HELEPERS --------------------------------------------------------------------------

   private Category findCategory(Long id) {
      return categoryRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Category not found"));
   }

}