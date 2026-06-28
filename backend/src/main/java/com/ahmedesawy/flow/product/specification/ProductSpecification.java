package com.ahmedesawy.flow.product.specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.ahmedesawy.flow.occasion.Occasion;
import com.ahmedesawy.flow.product.Product;
import com.ahmedesawy.flow.product.color.ProductColor;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {

   public static Specification<Product> filter(
      List<Long> categoryIds,
      List<Long> occasionIds,
      List<Long> colorIds,
      BigDecimal minPrice,
      BigDecimal maxPrice
   ) {
      return (root, query, cb) -> {

         List<Predicate> predicates = new ArrayList<>();

         if (categoryIds != null && !categoryIds.isEmpty()) {
            predicates.add(
               root.get("category").get("id").in(categoryIds)
            );
         }

         if (occasionIds != null && !occasionIds.isEmpty()) {
            Join<Product, Occasion> occasionJoin = root.join("occasion");
            predicates.add(
               occasionJoin.get("id").in(occasionIds)
            );
         }

         if (colorIds != null && !colorIds.isEmpty()) {
            Join<Product, ProductColor> colorJoin = root.join("productColors");
            predicates.add(
               colorJoin.get("color").get("id").in(colorIds)
            );
         }

         if (minPrice != null) {
            predicates.add(
               cb.greaterThanOrEqualTo(
                  root.get("price"),
                  minPrice
               )
            );
         }

         if (maxPrice != null) {
            predicates.add(
               cb.lessThanOrEqualTo(
                  root.get("price"),
                  maxPrice
               )
            );
         }
         query.distinct(true);
         return cb.and(predicates.toArray(new Predicate[0]));
      };
   }
}
