package com.ecommerce.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.dashboard.dto.request.section.SectionProductRequest;
import com.ecommerce.dashboard.dto.request.section.SectionRequest;
import com.ecommerce.dashboard.dto.response.section.SectionProductResponse;
import com.ecommerce.dashboard.dto.response.section.SectionResponse;
import com.ecommerce.dashboard.exception.NotFoundException;
import com.ecommerce.dashboard.mapper.SectionMapper;
import com.ecommerce.dashboard.model.Section;
import com.ecommerce.dashboard.model.SectionProduct;
import com.ecommerce.dashboard.repository.SectionProductRepository;
import com.ecommerce.dashboard.repository.SectionRepository;



@Service
@Transactional
public class SectionService {

   private static final int MAX_PRODUCTS = 15;

   private final SectionRepository sectionRepo;
   private final SectionProductRepository sectionProductRepo;
   private final SectionMapper sectionMapper;

   
   public SectionService(
      SectionRepository sectionRepo, 
      SectionProductRepository sectionProductRepo,
      SectionMapper sectionMapper
   ) {
      this.sectionRepo = sectionRepo;
      this.sectionProductRepo = sectionProductRepo;
      this.sectionMapper = sectionMapper;
   }

   public SectionResponse createSection(SectionRequest req) {
      Section section = sectionMapper.toEntity(req);
      return sectionMapper.toResponse(sectionRepo.save(section));
   }

   public List<SectionResponse> getAllSections() {
      return sectionRepo.findAll()
            .stream()
            .map(sectionMapper::toResponse)
            .toList();
   }

   public SectionResponse updateSection(Long id, SectionRequest req) {
      Section section = sectionRepo.findById(id)
               .orElseThrow(() -> new NotFoundException("Section not found"));
      if (req.name() != null) section.setName(req.name());
      if (req.isActive() != null) section.setIsActive(req.isActive());
      return sectionMapper.toResponse(sectionRepo.save(section));
   }

   public void deleteSection(Long id) {
      sectionRepo.deleteById(id);
   }

   public SectionProductResponse addProduct(Long sectionId, SectionProductRequest req) {
      int count = sectionProductRepo.countBySectionId(sectionId);
      if (count >= MAX_PRODUCTS) {
         throw new IllegalStateException("Section cannot have more than 15 products");
      }
      Section section = sectionRepo.findById(sectionId)
               .orElseThrow(() -> new NotFoundException("Section not found"));
      SectionProduct sp = new SectionProduct();
      sp.setSection(section);
      sp.setProductId(req.productId());
      sp.setSortOrder(req.sortOrder() != null ? req.sortOrder() : count);
      return sectionMapper.toProductResponse(sectionProductRepo.save(sp));
   }

   public void removeProduct(Long sectionId, Long productId) {
      sectionProductRepo.deleteBySectionIdAndProductId(sectionId, productId);
   }
}