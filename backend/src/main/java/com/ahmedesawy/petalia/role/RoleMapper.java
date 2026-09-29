package com.ahmedesawy.petalia.role;

import com.ahmedesawy.petalia.role.dto.RoleResponse;

public class RoleMapper {
    // ---- MAIN
    public static RoleResponse toResponse(Role role) {
        return new RoleResponse(
                role.getId(),
                role.getCode(),
                role.getNameEn(),
                role.getNameAr(),
                role.getDescriptionEn(),
                role.getDescriptionAr());
    }
}
