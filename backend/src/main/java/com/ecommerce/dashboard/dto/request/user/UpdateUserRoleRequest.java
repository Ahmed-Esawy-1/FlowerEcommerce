package com.ecommerce.dashboard.dto.request.user;

import com.ecommerce.dashboard.model.Role;

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
