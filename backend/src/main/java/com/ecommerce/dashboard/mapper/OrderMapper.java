package com.ecommerce.dashboard.mapper;

import java.util.List;

import com.ecommerce.dashboard.dto.response.order.OrderItemResponse;
import com.ecommerce.dashboard.dto.response.order.OrderSummaryResponse;
import com.ecommerce.dashboard.dto.response.order.OrderDetailResponse;
import com.ecommerce.dashboard.dto.response.product.ProductSummaryResponse;
import com.ecommerce.dashboard.dto.response.user.UserResponse;
import com.ecommerce.dashboard.model.Order;

public class OrderMapper {

   public static OrderSummaryResponse mapToSummary(Order order) {
      OrderSummaryResponse response = new OrderSummaryResponse();

      response.setId(order.getId());
      response.setCustomerName(order.getUser().getUserName());
      response.setCustomerEmail(order.getUser().getEmail());
      response.setCustomerImage("/api/upload_images/users/" + order.getUser().getImageUrl());
      response.setCreatedAt(order.getCreatedAt());
      response.setTotalPrice(order.getTotalPrice());
      response.setStatus(order.getStatus());

      return response;
   }


   public static OrderDetailResponse mapToDetail(Order order) {

   OrderDetailResponse response = new OrderDetailResponse();

   response.setId(order.getId());
   response.setTotalPrice(order.getTotalPrice());
   response.setStatus(order.getStatus());
   response.setPaymentMethod(order.getPaymentMethod());
   response.setShippingAddress(order.getShippingAddress());
   response.setCreatedAt(order.getCreatedAt());
   response.setUpdatedAt(order.getUpdatedAt());

   // User
   UserResponse userResponse = new UserResponse();

   userResponse.setId(order.getUser().getId());
   userResponse.setUserName(order.getUser().getUserName());
   userResponse.setEmail(order.getUser().getEmail());
   userResponse.setImageUrl("/api/upload_images/users/" + order.getUser().getImageUrl());

   response.setUser(userResponse);

    // Items
   List<OrderItemResponse> itemResponses = order.getItems()
         .stream()
         .map(item -> {

            ProductSummaryResponse productResponse = new ProductSummaryResponse();

            productResponse.setId(item.getProduct().getId());
            productResponse.setTitle(item.getProduct().getTitle());
            productResponse.setPrice(item.getProduct().getPrice());

            if (!item.getProduct().getImages().isEmpty()) {
                  productResponse.setFirstImage(
                     "/api/upload_images/products/" + 
                     item.getProduct().getImages().get(0).getImageUrl()
                  ) ;
            }

            OrderItemResponse itemResponse = new OrderItemResponse();

            itemResponse.setId(item.getId());
            itemResponse.setProduct(productResponse);
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setPrice(item.getPrice());

            return itemResponse;
         })
         .toList();

      response.setItems(itemResponses);

      return response;
}
}
