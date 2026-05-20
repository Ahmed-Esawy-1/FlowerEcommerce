package com.ecommerce.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.exception.BadRequestException;
import com.ecommerce.dashboard.exception.NotFoundException;
import com.ecommerce.dashboard.mapper.OccasionMapper;
import com.ecommerce.dashboard.model.Occasion;
import com.ecommerce.dashboard.repository.OccasionRepository;

@Service
public class OccasionService {
   public final OccasionRepository occasionRepository;
   public final FileStorageService fileStorageService;

   public OccasionService(OccasionRepository occasionRepository, FileStorageService fileStorageService) {
      this.occasionRepository = occasionRepository;
      this.fileStorageService = fileStorageService;
   }

   // All Occasions
   public List<Occasion> getAllOccasions(){
      return occasionRepository.findAll()
         .stream()
         .map(OccasionMapper::mapToDto)
         .toList();
   }

   // Occasion By Id
   public Occasion getOccasionById(Long id) {
      Occasion existing = occasionRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Occasion Not Found"));

      return OccasionMapper.mapToDto(existing);
   }

   // Create New Occasion
   public Occasion createOccasion(String name, MultipartFile img){
      if(occasionRepository.existsByName(name)) {
         throw new NotFoundException("Occasion is Found");
      }
      Occasion newOccasion = new Occasion();
      newOccasion.setName(name);

      if(img != null && !img.isEmpty()) {
         newOccasion.setImageUrl(fileStorageService.uploadImage(img, "occasions"));
      } else {
         newOccasion.setImageUrl(null);
      }

      Occasion saved = occasionRepository.save(newOccasion);

      return OccasionMapper.mapToDto(saved);
   }

   // Update Occasion
   public Occasion updateOccasion(Long id, String name, MultipartFile file) {
      Occasion existing = occasionRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Occasion not Found."));

      if (name != null && !name.trim().isEmpty()) {

         if (!existing.getName().equals(name)) {

            if (occasionRepository.existsByName(name)) {
               throw new BadRequestException("This name is alerady exist!");
            }

            existing.setName(name);
         }
      }
   
      if(file != null && !file.isEmpty()) {

         if(existing.getImageUrl() != null) {
            try {
               fileStorageService.deleteFile("occasions/" + existing.getImageUrl());
            } catch (Exception e) {}
         }

         existing.setImageUrl(fileStorageService.uploadImage(file, "occasions"));
      }

      return occasionRepository.save(existing);
   }

   // Delete Occasion
   public void deleteById(Long id) {
      Occasion existing = occasionRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Occasion not Found."));
      if(existing.getImageUrl() != null) {

         try {
            fileStorageService.deleteFile("occasions/" + existing.getImageUrl());
         } catch (Exception e) {}

      }

      occasionRepository.delete(existing);
   }

}
