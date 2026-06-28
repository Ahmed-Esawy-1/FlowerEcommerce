package com.ahmedesawy.flow.user;

import com.ahmedesawy.flow.user.dto.response.UserResponse;

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