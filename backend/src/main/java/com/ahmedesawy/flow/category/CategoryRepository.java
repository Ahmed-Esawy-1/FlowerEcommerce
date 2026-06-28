package com.ahmedesawy.flow.category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;


public interface CategoryRepository extends JpaRepository<Category, Long> {

   public Boolean existsByNameEn(String name);
   public Boolean existsByNameAr(String name);
   
   public List<Category> findAllByDeletedAtIsNullOrderByUpdatedAtDesc();

   public List<Category> findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();

   @Modifying
   @Query("""
      UPDATE Category c
      SET c.deletedAt = null
      WHERE c.id IN :ids
   """)
   void restoreBulk(List<Long> ids);

}