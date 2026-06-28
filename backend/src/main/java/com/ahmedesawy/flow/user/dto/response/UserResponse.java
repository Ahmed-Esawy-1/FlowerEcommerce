package com.ahmedesawy.flow.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserResponse {

  private Long id;
  private String userName;
  private String email;
  private String imageUrl;

}
