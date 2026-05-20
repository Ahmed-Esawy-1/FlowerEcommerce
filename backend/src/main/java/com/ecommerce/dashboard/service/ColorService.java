package com.ecommerce.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.dashboard.exception.NotFoundException;
import com.ecommerce.dashboard.exception.ResourceAlreadyExistsException;
import com.ecommerce.dashboard.model.Color;
import com.ecommerce.dashboard.repository.ColorRepository;

@Service
public class ColorService {
   
   final private ColorRepository colorRepository;

   public ColorService(ColorRepository colorRepository) {
      this.colorRepository = colorRepository;
   }


   // Get All Colors
   public List<Color> getAllColors() {
      return colorRepository.findAll();
   }

   // Get All Colors
   public Color getColorById(Long id) {
      return colorRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Color Not Found"));
   }

   // Create Color
   public Color createColor(String name, String hexCode) {

      if(colorRepository.existsByName(name)) {
         throw new ResourceAlreadyExistsException("This Color is Exist");
      }

      Color newColor = new Color();
      newColor.setName(name);
      newColor.setHexCode(hexCode);

      return colorRepository.save(newColor);
   }

   // Update Color
   public Color updateColor(Long id, String name, String hexCode) {

      Color existing = colorRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Color Not Found"));

      if(name != null && !name.isBlank()) {

         if (!name.equals(existing.getName()) &&
            colorRepository.existsByName(name)) {
               throw new ResourceAlreadyExistsException("Color already exists!");
         }

         existing.setName(name);
      }
      existing.setHexCode(hexCode);

      return colorRepository.save(existing);
   }

   // Delete Color
   public void deleteColor(Long id) {

      if(!colorRepository.existsById(id)) {
         throw new NotFoundException("Color Not Found");
      }

      colorRepository.deleteById(id);
   }

}
