package com.ecommerce.dashboard.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.dashboard.dto.request.order.OrderItemRequest;
import com.ecommerce.dashboard.dto.request.order.OrderRequest;
import com.ecommerce.dashboard.dto.request.order.UpdateOrderStatusRequest;
import com.ecommerce.dashboard.dto.response.order.OrderDetailResponse;
import com.ecommerce.dashboard.dto.response.order.OrderSummaryResponse;
import com.ecommerce.dashboard.exception.BadRequestException;
import com.ecommerce.dashboard.exception.NotFoundException;
import com.ecommerce.dashboard.mapper.OrderMapper;
import com.ecommerce.dashboard.model.Order;
import com.ecommerce.dashboard.model.OrderItem;
import com.ecommerce.dashboard.model.OrderStatus;
import com.ecommerce.dashboard.model.Product;
import com.ecommerce.dashboard.model.User;
import com.ecommerce.dashboard.repository.OrderRepository;
import com.ecommerce.dashboard.repository.ProductRepository;
import com.ecommerce.dashboard.repository.UserRepository;

@Service
public class OrderService {
   private final OrderRepository orderRepository;
   private final ProductRepository productRepository;
   private final UserRepository userRepository;

   public OrderService(
      OrderRepository orderRepository,
      ProductRepository productRepository,
      UserRepository userRepository) 
   {
      this.orderRepository = orderRepository;
      this.productRepository = productRepository;
      this.userRepository = userRepository;
   }

   // Get All Orders
   public Page<OrderSummaryResponse> getAllOrders(int page, int size, OrderStatus status) {
      Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

      if (status != null) {
         return orderRepository.findByStatus(status, pageable)
               .map(OrderMapper::mapToSummary);
      }

      return orderRepository.findAll(pageable)
            .map(OrderMapper::mapToSummary);
   }

   // Get Order By Id
   public OrderDetailResponse getOrderById(Long id) {
      Order order = orderRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order not found"));

      return OrderMapper.mapToDetail(order);
   }


   // Create
   @Transactional
   public Order createOrder(OrderRequest request) {

      User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new NotFoundException("User not found"));

      Order order = new Order();

      order.setUser(user);
      order.setStatus(OrderStatus.PENDING);
      order.setPaymentMethod(request.getPaymentMethod());
      order.setShippingAddress(request.getAddress());

      List<OrderItem> orderItems = new ArrayList<>();
      BigDecimal total = BigDecimal.ZERO;

      for (OrderItemRequest req : request.getItems()) {

         Product product = productRepository.findById(req.getProductId())
               .orElseThrow(() -> new NotFoundException("Product not found"));

         if (req.getQuantity() == null || req.getQuantity() <= 0) {
            throw new BadRequestException("Invalid quantity");
         }

         OrderItem item = new OrderItem();
         item.setOrder(order);
         item.setProduct(product);
         item.setQuantity(req.getQuantity());
         item.setPrice(product.getPrice());


         BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(req.getQuantity()));

         total = total.add(itemTotal);

         orderItems.add(item);
      }

      order.setItems(orderItems);
      order.setTotalPrice(total);


      return orderRepository.save(order);
   }

   // update
   @Transactional
   public OrderDetailResponse updateOrder(Long id, OrderRequest request) {

      Order existingOrder = orderRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order Not Found"));

      if (
         existingOrder.getStatus() == OrderStatus.SHIPPED ||
         existingOrder.getStatus() == OrderStatus.DELIVERED ||
         existingOrder.getStatus() == OrderStatus.CANCELLED
      ) {
         throw new BadRequestException("Order cannot be edited");
      }


      if (request.getUserId() != null && !request.getUserId().equals(existingOrder.getUser().getId())) {
         User user = userRepository.findById(request.getUserId())
               .orElseThrow(() -> new NotFoundException("User not found"));
         existingOrder.setUser(user);
      }


      if (request.getAddress() != null) {
         existingOrder.setShippingAddress(request.getAddress());
      }
      if (request.getPaymentMethod() != null) {
         existingOrder.setPaymentMethod(request.getPaymentMethod());
      }


      if(request.getItems() != null) {

         if(request.getItems().isEmpty()) {
            throw new BadRequestException("Order items cannot be empty");
         }

         existingOrder.getItems().clear();

         List<OrderItem> newItems = new ArrayList<>();
         BigDecimal total = BigDecimal.ZERO;


         for (OrderItemRequest req: request.getItems()) {

            Product product = productRepository.findById(req.getProductId())
                  .orElseThrow(() -> new NotFoundException("Product not found"));

            if (req.getQuantity() == null || req.getQuantity() <= 0) {
               throw new BadRequestException("Invalid quantity");
            }

            OrderItem item = new OrderItem();
            item.setOrder(existingOrder);
            item.setProduct(product);
            item.setQuantity(req.getQuantity());
            item.setPrice(product.getPrice());

            BigDecimal itemTotal =
                  product.getPrice().multiply(
                        BigDecimal.valueOf(req.getQuantity()));

            total = total.add(itemTotal);

            newItems.add(item);
         }

         existingOrder.getItems().addAll(newItems);
         existingOrder.setTotalPrice(total);
      }
      Order saved = orderRepository.save(existingOrder);
      return OrderMapper.mapToDetail(saved);
   }


   @Transactional
   public OrderDetailResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request
   ) {

      Order order = orderRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order not found"));

      order.setStatus(request.getStatus());

      Order saved = orderRepository.save(order);
      return OrderMapper.mapToDetail(saved);
   }

   // Delete
   public void deleteOrder(Long id) {
      Order order = orderRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order Not Fund"));

      orderRepository.delete(order);
   }

}
