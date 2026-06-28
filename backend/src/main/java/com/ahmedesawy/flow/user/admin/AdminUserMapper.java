package com.ahmedesawy.flow.user.admin;

import com.ahmedesawy.flow.user.User;
import com.ahmedesawy.flow.user.dto.response.AdminUserResponse;

public class AdminUserMapper {

   public static AdminUserResponse toResponse(User user) {

      AdminUserResponse response = new AdminUserResponse();

      response.setId(user.getId());
      response.setUserName(user.getUserName());
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