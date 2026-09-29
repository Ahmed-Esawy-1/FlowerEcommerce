package com.ahmedesawy.petalia.common.init;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.petalia.section.Section;
import com.ahmedesawy.petalia.section.SectionRepository;
import com.ahmedesawy.petalia.section.SectionType;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SectionInitService {

    private final SectionRepository sectionRepository;
    private static final Logger log = LoggerFactory.getLogger(SectionInitService.class);

    @Transactional 
    @PostConstruct
    public void initDefaultSections() {
        ensureSectionExists(SectionType.RELEASE, "Release", "منتجات جديدة", "/new-arrivals");
        ensureSectionExists(SectionType.BEST_SELLER, "Best Seller", "الأكثر مبيعاً", "/best-sellers");
    }
    
    private void ensureSectionExists(SectionType type, String nameEn, String nameAr, String urlVisit) {
        sectionRepository.findByType(type).orElseGet(() -> {
            log.info("Seeding default {} section", type);
            Section s = new Section();
            s.setNameEn(nameEn);
            s.setNameAr(nameAr);
            s.setUrlVisit(urlVisit);
            s.setType(type);
            return sectionRepository.save(s);
        });
    }
}