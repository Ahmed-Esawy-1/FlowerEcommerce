package com.ahmedesawy.flow.occasion;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface OccasionRepository extends JpaRepository<Occasion, Long> {

   public Boolean existsByNameEn(String name);
   
   public Boolean existsByNameAr(String name);

   public List<Occasion> findAllByDeletedAtIsNullOrderByUpdatedAtDesc();

   public List<Occasion> findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();

   // Restore Bulk Occasions
   @Modifying
   @Query("""
      UPDATE Occasion o
      SET o.deletedAt = null
      WHERE o.id IN :ids
   """)
   void restoreBulk(List<Long> ids);

}
