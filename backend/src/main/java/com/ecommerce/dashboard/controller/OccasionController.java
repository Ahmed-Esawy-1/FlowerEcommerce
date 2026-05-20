package com.ecommerce.dashboard.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.model.Occasion;
import com.ecommerce.dashboard.service.OccasionService;

import jakarta.validation.constraints.NotBlank;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;





@RestController
@Validated
@RequestMapping("occasions")
public class OccasionController {

  private final OccasionService occasionService;
  
  
  public OccasionController(OccasionService occasionService) {
    this.occasionService = occasionService;
  }


  // Get all Data
  @GetMapping
  public List<Occasion> getOccasions() {
    return occasionService.getAllOccasions();
  }

  // Get all Data
  @GetMapping("/{id}")
  public Occasion getOccasionById(@PathVariable Long id) {
    return occasionService.getOccasionById(id);
  }

  @PostMapping(consumes = "multipart/form-data")
  public Occasion createOccasion(
    @RequestParam @NotBlank(message = "Occasion name is required") String name,
    @RequestParam(value = "image", required = false) MultipartFile file) {
      return occasionService.createOccasion(name, file);
  }


  @PutMapping(value = "{id}", consumes = "multipart/form-data")
  public Occasion updateOccasion(
    @PathVariable Long id, 
    @RequestParam(value = "name", required = false) String name,
    @RequestParam(value = "image", required = false) MultipartFile file
  ) {
    return occasionService.updateOccasion(id, name, file);
  }

  // Delete Category
    @DeleteMapping("/{id}")
    public void deleteOccasion(@PathVariable Long id) {
      occasionService.deleteById(id);
    }
  
  
}
