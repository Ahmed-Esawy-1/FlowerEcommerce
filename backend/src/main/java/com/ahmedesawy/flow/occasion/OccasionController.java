package com.ahmedesawy.flow.occasion;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;





@RestController
@Validated
@RequestMapping("occasions")
@RequiredArgsConstructor
public class OccasionController {

   private final OccasionService occasionService;


   // ---- QUIRES ---------------------------------------------------------------------

   @GetMapping
   public List<Occasion> getAllOccasions() {
      return occasionService.getOccasions();
   }

   @GetMapping("/trash")
   public List<Occasion> getTrashOccaions() {
      return occasionService.getTrashOccaions();
   }

   @GetMapping("/{id}")
   public Occasion getOccasionById(@PathVariable Long id) {
      return occasionService.getOccasionById(id);
   }

   // ---- CREATE ---------------------------------------------------------------------

   @PostMapping(consumes = "multipart/form-data")
   public Occasion createOccasion(
      @RequestParam @NotBlank(message = "Occasion English Name is required") String nameEn,
      @RequestParam @NotBlank(message = "Occasion Arabic name is required") String nameAr,
      @RequestParam(value = "image", required = false) MultipartFile file) {
         return occasionService.create(nameEn, nameAr, file);
   }

   // ---- UPDATE ---------------------------------------------------------------------

   @PutMapping(value = "{id}", consumes = "multipart/form-data")
   public Occasion updateOccasion(
      @PathVariable Long id, 
      @RequestParam(value = "nameEn", required = false) String nameEn,
      @RequestParam(value = "nameAr", required = false) String nameAr,
      @RequestParam(value = "image", required = false) MultipartFile file
   ) {
      return occasionService.update(id, nameEn, nameAr, file);
   }

   // ---- SINGLE OPERATIONS ---------------------------------------------------------------------

   @PatchMapping("/{id}/restore")
   public void restoreOccasion(@PathVariable Long id) {
      occasionService.restore(id);
   }

   @DeleteMapping("/{id}")
   public void softDelete(@PathVariable Long id) {
      occasionService.softDelete(id);
   }

   @DeleteMapping("/{id}/permanent")
   public void permanentlyDelete(@PathVariable Long id) {
      occasionService.hardDelete(id);
   }
   
   // ---- BULK OPERATIONS ---------------------------------------------------------------------

   @PatchMapping("/restore/bulk")
   public void restoreBulk(@RequestBody List<Long> ids) {
      occasionService.restoreBulk(ids);
   }

   @DeleteMapping("/permanent/bulk")
   public void permanentlyDeleteBulk(@RequestBody List<Long> ids) {
      occasionService.hardDeleteBulk(ids);
   }

}
