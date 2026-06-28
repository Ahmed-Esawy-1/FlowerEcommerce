package com.ahmedesawy.flow.user.dto.request;

import com.ahmedesawy.flow.user.Role;

import jakarta.validation.constraints.NotBlank;

public class UpdateUserRoleRequest {

  @NotBlank
  private Role role;

  public Role getRole() {
    return role;
  }
  public void setRole(Role role) {
    this.role = role;
  }

}
