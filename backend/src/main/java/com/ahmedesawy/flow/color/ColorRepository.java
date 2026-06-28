package com.ahmedesawy.flow.color;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ColorRepository extends JpaRepository<Color, Long> {

   public Boolean existsByNameEn(String name);
   public Boolean existsByNameAr(String name);
   // Active
   public List<Color> findAllByDeletedAtIsNullOrderByUpdatedAtDesc();
   // Inactive
   public List<Color> findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();

   // Restore Bulk
   @Modifying
   @Query("""
      UPDATE Color c
      SET c.deletedAt = null
      WHERE c.id IN :ids
   """)
   void restoreBulk(List<Long> ids);
}
