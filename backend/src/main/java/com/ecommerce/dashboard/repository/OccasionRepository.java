package com.ecommerce.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.dashboard.model.Occasion;

public interface OccasionRepository extends JpaRepository<Occasion, Long> {
  public Boolean existsByName(String name);
}
