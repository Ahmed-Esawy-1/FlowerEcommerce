package com.ahmedesawy.flow.order;

import java.util.List;

import com.ahmedesawy.flow.order.dto.response.OrderDetailResponse;
import com.ahmedesawy.flow.order.dto.response.OrderItemResponse;
import com.ahmedesawy.flow.order.dto.response.OrderSummaryResponse;
import com.ahmedesawy.flow.order.item.OrderItem;
import com.ahmedesawy.flow.product.dto.response.ProductSummaryResponse;
import com.ahmedesawy.flow.user.dto.response.UserResponse;

public class OrderMapper {

   private static final String USER_IMAGE_PREFIX = "/api/upload_images/users/";

   // Order Summary 
   public static OrderSummaryResponse mapToSummary(Order order) {
      return new OrderSummaryResponse(
            order.getId(),
            order.getUser().getUserName(),
            order.getUser().getEmail(),
            USER_IMAGE_PREFIX + order.getUser().getImageUrl(),
            order.getCreatedAt(),
            order.getTotalPrice(),
            order.getStatus()
      );
   }

   // Order Detail 
   public static OrderDetailResponse mapToDetail(Order order) {
      return new OrderDetailResponse(
            order.getId(),
            mapUser(order),
            order.getTotalPrice(),
            order.getStatus(),
            order.getPaymentMethod(),
            order.getShippingAddress(),
            mapItems(order),
            order.getCreatedAt(),
            order.getUpdatedAt()
      );
   }

   
   private static UserResponse mapUser(Order order) {
      return new UserResponse(
            order.getUser().getId(),
            order.getUser().getUserName(),
            order.getUser().getEmail(),
            USER_IMAGE_PREFIX + order.getUser().getImageUrl()
      );
   }

   private static List<OrderItemResponse> mapItems(Order order) {
      return order.getItems()
            .stream()
            .map(OrderMapper::mapItem)
            .toList();
   }

   private static OrderItemResponse mapItem(OrderItem item) {

      ProductSummaryResponse product = new ProductSummaryResponse();

      product.setId(item.getProduct().getId());
      product.setTitle(item.getProduct().getTitle());
      product.setPrice(item.getProduct().getPrice());

      OrderItemResponse response = new OrderItemResponse(
            item.getId(),
            product,
            item.getQuantity(),
            item.getPrice()
      );

      return response;
   }
}