package com.ahmedesawy.petalia.role;

import java.util.Optional;
import java.util.UUID;

import com.ahmedesawy.petalia.common.base.FindOrThrowRepository;

public interface RoleRepository extends FindOrThrowRepository<Role, UUID> {
    Optional<Role> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByNameEn(String nameEn);

    boolean existsByNameAr(String nameAr);
}
