package com.ahmedesawy.flow.color;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.flow.common.exception.NotFoundException;
import com.ahmedesawy.flow.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.flow.occasion.Occasion;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ColorService {
   
   final private ColorRepository colorRepository;

   // ---- QUIRES ---------------------------------------------------------------------------

   public List<Color> getActiveColors() {
      return colorRepository.findAllByDeletedAtIsNullOrderByUpdatedAtDesc();
   }

   public List<Color> getTrashColors() {
      return colorRepository.findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();
   }

   public Color getColorById(Long id) {
      return findColor(id);
   }

   // ---- CREATE ---------------------------------------------------------------------------

   public Color create(String nameEn, String nameAr, String hexCode) {

      if(colorRepository.existsByNameEn(nameEn)) {
         throw new ResourceAlreadyExistsException("English name is aleardy Exist!");
      }

      if(colorRepository.existsByNameAr(nameAr)) {
         throw new ResourceAlreadyExistsException("Arabic name is aleardy Exist!");
      }

      Color newColor = new Color();
      newColor.setNameEn(nameEn);
      newColor.setNameAr(nameAr);
      newColor.setHexCode(hexCode);

      return colorRepository.save(newColor);
   }

   // ---- UPDATE ---------------------------------------------------------------------------
   @Transactional
   public Color update(Long id, String nameEn, String nameAr, String hexCode) {

      Color existing = findColor(id);

      if(nameEn != null && !nameEn.isBlank()) {

         if (!nameEn.equals(existing.getNameEn()) &&
            colorRepository.existsByNameEn(nameEn)) {
               throw new ResourceAlreadyExistsException("English name is already exists! Choose another name.");
         }

         existing.setNameEn(nameEn);
      }

      if(nameAr != null && !nameAr.isBlank()) {

         if (!nameAr.equals(existing.getNameAr()) &&
            colorRepository.existsByNameAr(nameAr)) {
               throw new ResourceAlreadyExistsException("Arabic name is already exists! Choose another name.");
         }

         existing.setNameAr(nameAr);
      }
      if(hexCode != null && !hexCode.isBlank()) {
         existing.setHexCode(hexCode);
      }

      return colorRepository.save(existing);
   }

   // ---- SINGLE OPERATIONS -----------------------------------------------------------------------

   public void restore(Long id) {
      Color existing = findColor(id);
      existing.setDeletedAt(null);
      colorRepository.save(existing);
   }

   public void softDelete(Long id) {
      Color existing = findColor(id);
      existing.setDeletedAt(LocalDateTime.now());
      colorRepository.save(existing);
   }

   public void hardDelete(Long id) {
      if(!colorRepository.existsById(id)) {
         throw new NotFoundException("Color Not Found");
      }
      colorRepository.deleteById(id);
   }

   // ---- BULK OPERATIONS ------------------------------------------------------------------------------------

   @Transactional
   public void restoreBulk(List<Long> ids) {
      colorRepository.restoreBulk(ids);
   }

   @Transactional
   public void hardDeleteBulk(List<Long> ids) {
      List<Color> colors = colorRepository.findAllById(ids);
      if (colors.isEmpty()) throw new NotFoundException("No colors Found");
      colorRepository.deleteAll(colors); 
   }

   // ---- HELPERS -----------------------------------------------------------------------------

   private Color findColor(Long id) {
      return colorRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Color Not Found."));
   }

}
