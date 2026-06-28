package com.ahmedesawy.flow.occasion;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ahmedesawy.flow.common.exception.BadRequestException;
import com.ahmedesawy.flow.common.exception.NotFoundException;
import com.ahmedesawy.flow.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.flow.common.storage.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OccasionService {

   public final OccasionRepository occasionRepository;
   public final FileStorageService fileStorageService;


   // --- QUIRES --------------------------------------------------------------------------------------

   public List<Occasion> getOccasions(){
      return occasionRepository.findAllByDeletedAtIsNullOrderByUpdatedAtDesc()
         .stream()
         .map(OccasionMapper::mapToDto)
         .toList();
   }

   public List<Occasion> getTrashOccaions(){
      return occasionRepository.findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc()
         .stream()
         .map(OccasionMapper::mapToDto)
         .toList();
   }

   public Occasion getOccasionById(Long id) {
      Occasion existing = findOccasion(id);
      return OccasionMapper.mapToDto(existing);
   }

   // -- CREATE ----------------------------------------------------------------------
   
   @Transactional
   public Occasion create(String nameEn, String nameAr, MultipartFile img) {
      if(occasionRepository.existsByNameEn(nameEn)) {
         throw new ResourceAlreadyExistsException("Occasion Name English is used");
      }
      if(occasionRepository.existsByNameAr(nameAr)) {
         throw new ResourceAlreadyExistsException("Occasion Name Arabic is used");
      }
      Occasion newOccasion = new Occasion();
      newOccasion.setNameEn(nameEn);
      newOccasion.setNameAr(nameAr);

      if(img != null && !img.isEmpty()) {
         newOccasion.setImageUrl(fileStorageService.uploadImage(img, "occasions"));
      } else {
         newOccasion.setImageUrl(null);
      }

      return OccasionMapper.mapToDto(occasionRepository.save(newOccasion));
   }

   // -- UPDATE ----------------------------------------------------------------------
   
   @Transactional
   public Occasion update(Long id, String nameEn, String nameAr, MultipartFile file) {
      Occasion existing = findOccasion(id);
      
      if (nameEn != null && !nameEn.trim().isEmpty()) {

         if (!existing.getNameEn().equals(nameEn)) {

            if (occasionRepository.existsByNameEn(nameEn)) {
               throw new BadRequestException("This english name is alerady exist!");
            }

            existing.setNameEn(nameEn);
         }
      }

      if (nameAr != null && !nameAr.trim().isEmpty()) {

         if (!existing.getNameAr().equals(nameAr)) {

            if (occasionRepository.existsByNameAr(nameAr)) {
               throw new BadRequestException("This arabic name is alerady exist!");
            }

            existing.setNameAr(nameAr);
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
      
      return OccasionMapper.mapToDto(occasionRepository.save(existing));
   }

   // -- SINGLE OPERATIONS ------------------------------------------------------------------------------------

   public void restore(Long id) {
      Occasion occasion = findOccasion(id);
      occasion.setDeletedAt(null);
      occasionRepository.save(occasion);
   }

   public void softDelete(Long id) {
      Occasion existing = findOccasion(id);
      existing.setDeletedAt(LocalDateTime.now());
      occasionRepository.save(existing);
   }

   public void hardDelete(Long id) {
      Occasion existing = findOccasion(id);

      if(existing.getImageUrl() != null) {
         try {
            fileStorageService.deleteFile("occasions/" + existing.getImageUrl());
         } catch (Exception e) {}
      }
      occasionRepository.delete(existing);
   }

   // -- BULK OPERATIONS ------------------------------------------------------------------------------------

   @Transactional
   public void restoreBulk(List<Long> ids) {
      occasionRepository.restoreBulk(ids);
   }

   @Transactional
   public void hardDeleteBulk(List<Long> ids) {
      List<Occasion> occaions = occasionRepository.findAllById(ids);
      if (occaions.isEmpty()) throw new NotFoundException("No Occasions Found");
      occasionRepository.deleteAll(occaions); 
   }

   // ---- HELPERS -------------------------------------------------------------

   private Occasion findOccasion(Long id) {
      return occasionRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Occasion not Found."));
   }

}
