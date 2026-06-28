package com.ahmedesawy.flow.section;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.flow.common.exception.NotFoundException;
import com.ahmedesawy.flow.product.ProductMapper;
import com.ahmedesawy.flow.product.ProductRepository;
import com.ahmedesawy.flow.product.dto.response.ProductResponse;
import com.ahmedesawy.flow.section.dto.request.SectionProductRequest;
import com.ahmedesawy.flow.section.dto.request.SectionRequest;
import com.ahmedesawy.flow.section.dto.response.SectionProductResponse;
import com.ahmedesawy.flow.section.dto.response.SectionResponse;
import com.ahmedesawy.flow.section.dto.response.SectionSummaryResponse;
import com.ahmedesawy.flow.section.product.SectionProduct;
import com.ahmedesawy.flow.section.product.SectionProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SectionService {

   private static final int MAX_PRODUCTS = 15;

   private final SectionRepository sectionRepository;
   private final SectionProductRepository sectionProductRepo;
   private final SectionMapper sectionMapper;
   private final ProductRepository productRepo;



   // ---- QUIRES -----------------------------------------------------------------------------------------

   public List<SectionResponse> getSections() {
      return sectionRepository.findAll()
            .stream()
            .map(sectionMapper::toResponse)
            .toList();
   }

   public List<ProductResponse> getSectionProducts(Long id) {
      Section section = findSection(id);

      return sectionProductRepo
            .findBySectionIdOrderBySortOrderAsc(id)
            .stream()
            .map(sp -> productRepo.findById(sp.getProductId())
                  .map(ProductMapper::toResponse)
                  .orElse(null))
            .filter(Objects::nonNull)
            .toList();
   }


   // // ---- CREATE -------------------------------------------------------------------------------------


   // public SectionResponse createSection(SectionRequest req) {
   //    Section section = sectionMapper.toEntity(req);
   //    return sectionMapper.toResponse(sectionRepo.save(section));
   // }



   // // Returns products for a single section — called lazily per section
   


   

   // public SectionResponse updateSection(Long id, SectionRequest req) {
   //    Section section = sectionRepo.findById(id)
   //             .orElseThrow(() -> new NotFoundException("Section not found"));
   //    if (req.name() != null) section.setName(req.name());
   //    if (req.isActive() != null) section.setIsActive(req.isActive());
   //    return sectionMapper.toResponse(sectionRepo.save(section));
   // }

   // public void deleteSection(Long id) {
   //    sectionRepo.deleteById(id);
   // }

   // public SectionProductResponse addProduct(Long sectionId, SectionProductRequest req) {
   //    int count = sectionProductRepo.countBySectionId(sectionId);
   //    if (count >= MAX_PRODUCTS) {
   //       throw new IllegalStateException("Section cannot have more than 15 products");
   //    }
   //    Section section = ;
   //    SectionProduct sp = new SectionProduct();
   //    sp.setSection(section);
   //    sp.setProductId(req.productId());
   //    sp.setSortOrder(req.sortOrder() != null ? req.sortOrder() : count);
   //    return sectionMapper.toProductResponse(sectionProductRepo.save(sp));
   // }

   // public void removeProduct(Long sectionId, Long productId) {
   //    sectionProductRepo.deleteBySectionIdAndProductId(sectionId, productId);
   // }

   // ---- HELPERS -------------------------------------------------------------------------------------

   private Section findSection(Long id){
      return sectionRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Section not found"));
   }
}