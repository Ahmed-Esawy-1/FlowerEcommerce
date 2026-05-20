package com.ecommerce.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.dashboard.model.Section;

public interface SectionRepository extends JpaRepository<Section, Long> {}