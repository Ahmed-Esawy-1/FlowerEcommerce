package com.ahmedesawy.flow.color;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/colors")
@RequiredArgsConstructor
public class ColorController {
   
   final private ColorService colorService;


   // ---- QUIRES ------------------------------------------------------------------------------

   @GetMapping
   public List<Color> getActiveColors() {
      return colorService.getActiveColors();
   }

   @GetMapping("/trash")
   public List<Color> getTrashColors() {
      return colorService.getTrashColors();
   }

   @GetMapping("/{id}")
   public Color getColorById(@PathVariable Long id) {
      return colorService.getColorById(id);
   }

   // ---- CREATE ---------------------------------------------------------------------------------

   @PostMapping
   public Color createColor(@RequestBody Color color) {
      return colorService.create(color.getNameEn(), color.getNameAr(), color.getHexCode());
   }
   
   // ---- UPDATE ---------------------------------------------------------------------------------

   @PutMapping("/{id}")
   public Color updateColor(@PathVariable Long id, @RequestBody Color color) {
      return colorService.update(id, color.getNameEn(), color.getNameAr(), color.getHexCode());
   }
   
   // ---- SINGLE OPERATIONS ------------------------------------------------------------------------
   
   @PatchMapping("/{id}/restore")
   public void restoreColor(@PathVariable Long id) {
      colorService.restore(id);
   }

   @DeleteMapping("/{id}")
   public void deleteColor(@PathVariable Long id) {
      colorService.softDelete(id);
   }

   @DeleteMapping("/{id}/permanent")
   public void permanentlyDelete(@PathVariable Long id) {
      colorService.hardDelete(id);
   }

   // ---- BULK OPERATIONS ------------------------------------------------------------------------
   
   @PatchMapping("/restore/bulk")
   public void restoreBulk(@RequestBody List<Long> ids) {
      colorService.restoreBulk(ids);
   }

   @DeleteMapping("/permanent/bulk")
   public void permanentlyDeleteBulk(@RequestBody List<Long> ids) {
      colorService.hardDeleteBulk(ids);
   }

}
