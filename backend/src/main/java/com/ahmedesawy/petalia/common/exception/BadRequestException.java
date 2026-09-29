package com.ahmedesawy.petalia.common.exception;

public class BadRequestException extends RuntimeException {

   public BadRequestException(String message) {
      super(message);
   }
}