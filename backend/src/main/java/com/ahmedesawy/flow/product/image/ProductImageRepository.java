package com.ahmedesawy.flow.product.image;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

   List<ProductImage> findAllByIdInAndProductId(List<Long> ids, Long productId);

}