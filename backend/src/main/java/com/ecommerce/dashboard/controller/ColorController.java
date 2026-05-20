package com.ecommerce.dashboard.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dashboard.model.Color;
import com.ecommerce.dashboard.service.ColorService;

import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/colors")
public class ColorController {
   
   final private ColorService colorService;

   
   public ColorController(ColorService colorService) {
      this.colorService = colorService;
   }



   // Get Colors
   @GetMapping
   public List<Color> getAllColors() {
      return colorService.getAllColors();
   }

   // Get Color Bu Id
   @GetMapping("/{id}")
   public Color getColorById(@PathVariable Long id) {
      return colorService.getColorById(id);
   }

   // Create Color 
   @PostMapping
   public Color createColor(@RequestBody Color color) {
      return colorService.createColor(color.getName(), color.getHexCode());
   }
   
   // Update Color 
   @PutMapping("/{id}")
   public Color updateColor(@PathVariable Long id, @RequestBody Color color) {
      return colorService.updateColor(id, color.getName(), color.getHexCode());
   }
   
   // Delte Color
   @DeleteMapping("/{id}")
   public void deleteColor(@PathVariable Long id) {
      colorService.deleteColor(id);
   }


}
