package com.ahmedesawy.petalia.user;

import com.ahmedesawy.petalia.common.util.ImageUrlResolver;
import com.ahmedesawy.petalia.user.employee.Employee;
import com.ahmedesawy.petalia.user.employee.dto.response.EmployeeResponse;
import com.ahmedesawy.petalia.user.employee.dto.response.UpdateEmployeeResponse;

public class UserMapper {

    // ---- MAIN EMPLOYEE Response
    public static EmployeeResponse toEmployeeResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .userName(employee.getUserName())
                .email(employee.getEmail())
                .imageUrl(ImageUrlResolver.resolve("users", employee.getImageUrl()))
                .role(employee.getRole().getCode())
                .permissions(employee.getRole().getPermissions())
                .build();
    }

    // ---- UPDATE EMPLOYEE Response
    public static UpdateEmployeeResponse toUpdateEmployeeResponse(Employee employee) {
        return UpdateEmployeeResponse.builder()
                .id(employee.getId())
                .userName(employee.getUserName())
                .email(employee.getEmail())
                .imageUrl(ImageUrlResolver.resolve("users", employee.getImageUrl()))
                .roleId(employee.getRole().getId())
                .build();
    }

    // --- TRASH Response
    public static TrashUserResponse toTrashResponse(Employee employee) {
        return TrashUserResponse.builder()
                .id(employee.getId())
                .userName(employee.getUserName())
                .imageUrl(ImageUrlResolver.resolve("users", employee.getImageUrl()))
                .deletedAt(employee.getDeletedAt())
                .build();
    }

}