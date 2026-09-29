package com.ahmedesawy.petalia.auth;

import java.util.Set;

import org.springframework.stereotype.Component;

import com.ahmedesawy.petalia.common.exception.ForbiddenException;
import com.ahmedesawy.petalia.role.Permission;
import com.ahmedesawy.petalia.role.Role;
import com.ahmedesawy.petalia.user.employee.Employee;

@Component
public class AuthorizationHelper {

    // ---- filter the assignable-roles (Role Service) -----------------------------
    public boolean canAssignRole(Role targetRole, EmployeePrincipal caller) {
        if (caller.isOwner())
            return true;
        if (Role.OWNER_CODE.equals(targetRole.getCode()))
            return false;
        if (isSameRole(targetRole, caller))
            return false;
        return caller.getPermissions().containsAll(permissionsOf(targetRole));
    }

    // ---- CREATE --------------------------------------
    public void assertCanAssignRole(Role targetRole, EmployeePrincipal caller) {
        if (caller.isOwner())
            return;

        if (Role.OWNER_CODE.equals(targetRole.getCode())) {
            throw new ForbiddenException("You are not allowed to assign the OWNER role");
        }

        if (isSameRole(targetRole, caller)) {
            throw new ForbiddenException("You cannot assign a role equal to your own");
        }

        if (!caller.getPermissions().containsAll(permissionsOf(targetRole))) {
            throw new ForbiddenException("You cannot assign a role with permissions you don't have");
        }
    }

    // ----- UPDATE -------------------------------
    public void assertCanModifyEmployee(Employee target, EmployeePrincipal caller) {
        if (caller.isOwner() || target.getId().equals(caller.getId()))
            return;

        Role targetRole = target.getRole();
        if (targetRole == null)
            return;

        if (Role.OWNER_CODE.equals(targetRole.getCode())) {
            throw new ForbiddenException("You cannot modify an OWNER account");
        }

        if (isSameRole(targetRole, caller)) {
            throw new ForbiddenException("You cannot modify an account with the same role as yours");
        }

        if (!caller.getPermissions().containsAll(permissionsOf(targetRole))) {
            throw new ForbiddenException("You cannot modify an account with higher privileges than yours");
        }
    }

    // ---- DELETE -------------------
    public void assertCanDeleteEmployee(Employee target, EmployeePrincipal caller) {
        if (target.getId().equals(caller.getId())) {
            throw new ForbiddenException("You cannot delete your own account");
        }
        assertCanModifyEmployee(target, caller);
    }

    // ---- HELPERS ------------------------
    private boolean isSameRole(Role role, EmployeePrincipal caller) {
        return role != null && role.getCode() != null
                && role.getCode().equals(caller.getRoleName());
    }

    private Set<Permission> permissionsOf(Role role) {
        return role.getPermissions() == null ? Set.of() : role.getPermissions();
    }
}