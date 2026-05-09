package com.ecommerce.dashboard.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.dashboard.dto.request.OrderItemRequest;
import com.ecommerce.dashboard.model.Order;
import com.ecommerce.dashboard.model.OrderItem;
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
  public List<Order> getAllOrders() {
    return orderRepository.findAll();
  }


  // Create
  public Order createOrder(Long userId, List<OrderItemRequest> items, String address, String paymentMethod) {

    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    Order order = new Order();

    order.setUser(user);
    order.setStatus("PENDING");
    order.setPaymentMethod(paymentMethod);
    order.setShippingAddress(address);

    List<OrderItem> orderItems = new ArrayList<>();
    double total = 0;

    for (OrderItemRequest req : items) {

      Product product = productRepository.findById(req.getProductId())
          .orElseThrow(() -> new RuntimeException("Product not found"));

      if (req.getQuantity() == null || req.getQuantity() <= 0) {
        throw new RuntimeException("Invalid quantity");
      }

      OrderItem item = new OrderItem();
      item.setProduct(product);
      item.setQuantity(req.getQuantity());
      item.setPrice(product.getPrice());
      item.setOrder(order);

      total += item.getPrice() * item.getQuantity();

      orderItems.add(item);
    }

    order.setItems(orderItems);
    order.setTotalPrice(total);


    return orderRepository.save(order);
  }
}
