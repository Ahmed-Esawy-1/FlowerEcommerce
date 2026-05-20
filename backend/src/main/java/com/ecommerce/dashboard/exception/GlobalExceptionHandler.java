package com.ecommerce.dashboard.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

   @ExceptionHandler(Exception.class)
   public ResponseEntity<?> handleGeneral(Exception ex) {

      Map<String, Object> response = new HashMap<>();

      response.put("status", 500);
      response.put("error", "Internal Server Error");
      response.put("message", ex.getMessage());
      response.put("timestamp", LocalDateTime.now());

      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
   }

   @ExceptionHandler(NotFoundException.class)
   public ResponseEntity<?> handleNotFound(NotFoundException e) {

      Map<String, Object> response = new HashMap<>();

      response.put("status", 404);
      response.put("error", "Not Found");
      response.put("message", e.getMessage());
      response.put("timestamp", LocalDateTime.now());

      return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
   }

   @ExceptionHandler(BadRequestException.class)
   public ResponseEntity<?> handleBadRequest(BadRequestException e) {

      Map<String, Object> response = new HashMap<>();

      response.put("status", 400);
      response.put("error", "Bad Request");
      response.put("message", e.getMessage());
      response.put("timestamp", LocalDateTime.now());

      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
   }

   @ExceptionHandler(ResourceAlreadyExistsException.class)
   public ResponseEntity<?> handleBadRequest(ResourceAlreadyExistsException e) {

      Map<String, Object> response = new HashMap<>();

      response.put("status", 409);
      response.put("error", "Confilct");
      response.put("message", e.getMessage());
      response.put("timestamp", LocalDateTime.now());

      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
   }

   @ExceptionHandler(FileOperationException.class)
   public ResponseEntity<?> handleFileError(FileOperationException ex) {

      Map<String, Object> response = new HashMap<>();

      response.put("status", 500);
      response.put("error", "File Operation Failed");
      response.put("message", ex.getMessage());
      response.put("timestamp", LocalDateTime.now());

      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
   }

}