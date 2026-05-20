package com.ecommerce.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.dashboard.model.Color;

public interface ColorRepository extends JpaRepository<Color, Long> {
   public Boolean existsByName(String name);
}
