package com.ahmedesawy.flow.order;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.flow.common.exception.BadRequestException;
import com.ahmedesawy.flow.common.exception.NotFoundException;
import com.ahmedesawy.flow.order.dto.request.OrderItemRequest;
import com.ahmedesawy.flow.order.dto.request.OrderRequest;
import com.ahmedesawy.flow.order.dto.request.UpdateOrderStatusRequest;
import com.ahmedesawy.flow.order.dto.response.OrderDetailResponse;
import com.ahmedesawy.flow.order.dto.response.OrderSummaryResponse;
import com.ahmedesawy.flow.order.item.OrderItem;
import com.ahmedesawy.flow.product.Product;
import com.ahmedesawy.flow.product.ProductRepository;
import com.ahmedesawy.flow.user.User;
import com.ahmedesawy.flow.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

   private final OrderRepository orderRepository;
   private final ProductRepository productRepository;
   private final UserRepository userRepository;

   // Get All Orders Summary
   @Transactional(readOnly = true)
   public Page<OrderSummaryResponse> getAllOrdersSummary(int page, int size, OrderStatus status) {
      Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

      if (status != null)
         return orderRepository.findByStatus(status, pageable).map(OrderMapper::mapToSummary);

      return orderRepository.findAll(pageable).map(OrderMapper::mapToSummary);
   }

   // Get Order By Id (Details)
   @Transactional(readOnly = true)
   public OrderDetailResponse getOrderById(Long id) {
      Order order = orderRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order Not Found"));

      return OrderMapper.mapToDetail(order);
   }

   // Create
   @Transactional
   public Order createOrder(OrderRequest request) {

      if (request.getItems() == null || request.getItems().isEmpty()) {
         throw new BadRequestException("Order must contain at least one item");
      }

      User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new NotFoundException("User not found"));

      List<Long> productIds = request.getItems()
            .stream()
            .map(OrderItemRequest::getProductId)
            .toList();

      Map<Long, Product> productsById = productRepository.findAllById(productIds)
            .stream()
            .collect(Collectors.toMap(Product::getId, Function.identity()));

      Order order = new Order();
      order.setUser(user);
      order.setStatus(OrderStatus.PENDING);
      order.setPaymentMethod(request.getPaymentMethod());
      order.setShippingAddress(request.getAddress());

      List<OrderItem> orderItems = new ArrayList<>();
      BigDecimal total = BigDecimal.ZERO;

      for (OrderItemRequest req : request.getItems()) {

         if (req.getQuantity() == null || req.getQuantity() <= 0) {
            throw new BadRequestException("Invalid quantity for product " + req.getProductId());
         }

         Product product = productsById.get(req.getProductId());
         if (product == null) {
            throw new NotFoundException("Product not found: " + req.getProductId());
         }

         OrderItem item = new OrderItem();
         item.setOrder(order);
         item.setProduct(product);
         item.setQuantity(req.getQuantity());
         item.setPrice(product.getPrice());

         BigDecimal itemTotal = product.getPrice()
               .multiply(BigDecimal.valueOf(req.getQuantity()));

         total = total.add(itemTotal);

         orderItems.add(item);
      }

      order.setItems(orderItems);
      order.setTotalPrice(total.setScale(2, RoundingMode.HALF_UP));

      return orderRepository.save(order);
   }

   // Update (Pending Only)
   @Transactional
   public OrderDetailResponse updateOrder(Long id, OrderRequest request) {

      Order existingOrder = orderRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order Not Found"));

      if (existingOrder.getStatus() != OrderStatus.PENDING) {
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

         List<Long> productIds = request.getItems()
               .stream()
               .map(OrderItemRequest::getProductId)
               .toList();

         Map<Long, Product> productsById = productRepository.findAllById(productIds)
               .stream()
               .collect(Collectors.toMap(Product::getId, Function.identity()));

         List<OrderItem> newItems = new ArrayList<>();
         BigDecimal total = BigDecimal.ZERO;


         for (OrderItemRequest req: request.getItems()) {

            if (req.getQuantity() == null || req.getQuantity() <= 0) {
               throw new BadRequestException("Invalid quantity for product " + req.getProductId());
            }

            Product product = productsById.get(req.getProductId());
            if (product == null) {
               throw new NotFoundException("Product not found: " + req.getProductId());
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

         existingOrder.getItems().clear();
         existingOrder.getItems().addAll(newItems);
         existingOrder.setTotalPrice(total.setScale(2, RoundingMode.HALF_UP));
      }
      Order saved = orderRepository.save(existingOrder);
      return OrderMapper.mapToDetail(saved);
   }


   // Update Order Status Only
   @Transactional
   public OrderDetailResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {

      Order order = orderRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order Not Found"));

      if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
         throw new BadRequestException("Cannot change status of a " + order.getStatus() + " order");
      }

      order.setStatus(request.getStatus());

      return OrderMapper.mapToDetail(orderRepository.save(order));
   }

   // Delete (Delivered Not Allowed)
   @Transactional
   public void deleteOrder(Long id) {
      Order order = orderRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order Not Found"));

      if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CANCELLED) {
         throw new BadRequestException("Only pending or cancelled orders can be deleted");
      }

      orderRepository.delete(order);
   }

}