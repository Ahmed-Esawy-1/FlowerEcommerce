package com.ahmedesawy.petalia.product.specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.ahmedesawy.petalia.category.Category;
import com.ahmedesawy.petalia.occasion.Occasion;
import com.ahmedesawy.petalia.order.item.OrderItem;
import com.ahmedesawy.petalia.product.Product;
import com.ahmedesawy.petalia.product.ProductColor;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class ProductSpecification {

   public static Specification<Product> filter(
      List<Long> categoryIds,
      List<Long> occasionIds,
      List<Long> colorIds,
      BigDecimal minPrice,
      BigDecimal maxPrice,
      String sortBy
   ) {
      return (root, query, cb) -> {

         List<Predicate> predicates = new ArrayList<>();

         if (categoryIds != null && !categoryIds.isEmpty()) {
            Join<Product, Category> categoryJoin = root.join("categories");
            predicates.add(
               categoryJoin.get("id").in(categoryIds)
            );
         }

         if (occasionIds != null && !occasionIds.isEmpty()) {
            Join<Product, Occasion> occasionJoin = root.join("occasions");
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


         // Sort
         if (Long.class != query.getResultType() && long.class != query.getResultType()) {
            if ("bestSellers".equals(sortBy)) {
               Subquery<Long> orderCountSubquery = query.subquery(Long.class);
               Root<OrderItem> orderItemRoot = orderCountSubquery.from(OrderItem.class);
               orderCountSubquery
                  .select(cb.count(orderItemRoot))
                  .where(cb.equal(orderItemRoot.get("product"), root));

               query.orderBy(cb.desc(orderCountSubquery));
            } else if ("newest".equals(sortBy)) {
               query.orderBy(cb.desc(root.get("createdAt")));
            } else {
               query.orderBy(cb.desc(root.get("id")));
            }
         }

         query.distinct(true);
         return cb.and(predicates.toArray(new Predicate[0]));
      };
   }
}