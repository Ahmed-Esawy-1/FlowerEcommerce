package com.ahmedesawy.petalia.category;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ahmedesawy.petalia.common.base.FindOrThrowRepository;

public interface CategoryRepository extends FindOrThrowRepository<Category, Integer> {

   Boolean existsByNameEnIgnoreCase(String name);

   Boolean existsByNameArIgnoreCase(String name);

   Boolean existsByNameEnIgnoreCaseAndIdNot(String nameEn, Integer id);

   Boolean existsByNameArIgnoreCaseAndIdNot(String nameAr, Integer id);

   // Active | Order By UpdateAt
   List<Category> findAllByDeletedAtIsNullOrderByUpdatedAtDesc();

   // Inactive | Order By UpdateAt
   List<Category> findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();

   @Modifying
   @Query("""
            UPDATE Category c
            SET c.deletedAt = null
            WHERE c.id IN :ids
         """)
   void restoreBulk(List<Integer> ids);

}