package com.ahmedesawy.petalia.occasion;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ahmedesawy.petalia.common.base.FindOrThrowRepository;

public interface OccasionRepository extends FindOrThrowRepository<Occasion, Integer> {

   Boolean existsByNameEnIgnoreCase(String name);

   Boolean existsByNameArIgnoreCase(String name);

   Boolean existsByNameEnIgnoreCaseAndIdNot(String nameEn, Integer id);

   Boolean existsByNameArIgnoreCaseAndIdNot(String nameAr, Integer id);

   // Active | Order By UpdateAt
   public List<Occasion> findAllByDeletedAtIsNullOrderByUpdatedAtDesc();

   // Trash | Order By UpdateAt
   public List<Occasion> findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();

   // Restore Bulk
   @Modifying
   @Query("""
            UPDATE Occasion o
            SET o.deletedAt = null
            WHERE o.id IN :ids
         """)
   void restoreBulk(List<Integer> ids);

}
