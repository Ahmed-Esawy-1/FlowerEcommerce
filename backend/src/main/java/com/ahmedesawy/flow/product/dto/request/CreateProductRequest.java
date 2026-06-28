package com.ahmedesawy.flow.product.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProductRequest {

   @NotBlank
   private String title;

   @NotBlank
   private String description;

   @NotBlank
   private Boolean hasColor;

   @NotNull
   @Positive
   private BigDecimal price;

   private Long categoryId;
   private Long occasionId;

}
