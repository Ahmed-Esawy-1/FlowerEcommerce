package com.ahmedesawy.flow.section.dto.response;


// Lightweight response — no products embedded
// Used by the storefront GET /api/sections endpoint
public record SectionSummaryResponse(Long id, String name, Boolean isActive) {}