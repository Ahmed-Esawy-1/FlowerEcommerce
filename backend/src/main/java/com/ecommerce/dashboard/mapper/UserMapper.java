package com.ecommerce.dashboard.mapper;

import com.ecommerce.dashboard.dto.response.UserResponse;
import com.ecommerce.dashboard.model.User;

public class UserMapper {

    public static UserResponse mapToDto(User user) {

      UserResponse response = new UserResponse();

      response.setId(user.getId());
      response.setName(user.getName());
      response.setEmail(user.getEmail());
      if(user.getImageUrl() != null) {
        response.setImageUrl("/api/upload_images/users/" + user.getImageUrl());
      } else {
        response.setImageUrl(null);
      }
      response.setRole(user.getRole());

      return response;
  }
}