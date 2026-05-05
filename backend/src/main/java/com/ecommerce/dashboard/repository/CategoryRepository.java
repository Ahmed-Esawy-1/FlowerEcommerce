package com.ecommerce.dashboard.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.dashboard.model.Category;


public interface CategoryRepository extends JpaRepository<Category, Long> {
}