package com.ecommerce.dashboard.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dashboard.dto.request.OrderRequest;
import com.ecommerce.dashboard.model.Order;
import com.ecommerce.dashboard.repository.OrderRepository;
import com.ecommerce.dashboard.service.OrderService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/orders")
public class OrderController {

  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @GetMapping
  public List<Order> getOrders() {
    return orderService.getAllOrders(); // create this in service
  }
  

  @PostMapping
    public Order createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(
                request.getUserId(),
                request.getItems(),
                request.getShippingAddress(),
                request.getPaymentMethod()
        );
    }
  

}
