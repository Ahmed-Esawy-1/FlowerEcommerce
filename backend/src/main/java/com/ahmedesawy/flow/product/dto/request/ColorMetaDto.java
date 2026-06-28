package com.ahmedesawy.flow.product.dto.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class ColorMetaDto {

   private Long colorId;
   private Long productColorId;
   @JsonProperty("isNew")
   private boolean isNew;
   private List<Long> removeImageIds;
   
}