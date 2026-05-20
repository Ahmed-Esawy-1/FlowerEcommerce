package com.ecommerce.dashboard.mapper;

import com.ecommerce.dashboard.dto.response.user.UserResponse;
import com.ecommerce.dashboard.model.User;

public class UserMapper {

   public static UserResponse toResponse(User user) {

      UserResponse response = new UserResponse();

      response.setId(user.getId());
      response.setUserName(user.getUserName());
      response.setEmail(user.getEmail());

      if(user.getImageUrl() != null) {
         response.setImageUrl("/api/upload_images/users/" + user.getImageUrl());
      } else {
         response.setImageUrl(null);
      }

      return response;
   }
}