package com.ahmedesawy.flow.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@AllArgsConstructor
@Getter
@Setter
public class TopProductDTO {

   private Long id;
   private String name;
   private Long orderCount;
   
}