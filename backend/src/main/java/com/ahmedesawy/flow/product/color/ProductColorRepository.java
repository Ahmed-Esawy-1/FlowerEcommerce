package com.ahmedesawy.flow.product.color;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductColorRepository extends JpaRepository<ProductColor, Long> {

    /** Check if a color is already assigned to a product */
    Optional<ProductColor> findByProductIdAndColorId(Long productId, Long colorId);

    /**
     * Find a specific ProductColor by its own ID and its parent product ID.
     * Used in updateColorImages to scope the lookup to the right product.
     */
    Optional<ProductColor> findByIdAndProductId(Long id, Long productId);

    /**
     * Find multiple ProductColors by their IDs scoped to a product.
     * Used in soft-delete, restore, and hard-delete bulk operations.
     */
    List<ProductColor> findAllByIdInAndProductId(List<Long> ids, Long productId);
}