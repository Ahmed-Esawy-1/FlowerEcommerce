package com.ahmedesawy.flow;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.ahmedesawy.flow.order.Order;
import com.ahmedesawy.flow.order.OrderRepository;
import com.ahmedesawy.flow.order.OrderStatus;



@SpringBootTest
class DashboardApplicationTests {

   private static final Logger log = LoggerFactory.getLogger(DashboardApplicationTests.class);


   @Autowired
   private OrderRepository orderRepository;

   @Test
   void first() {
      System.out.println("=======================================");
   }

   @Test
   void mainFunc() {
      // This will print to the console now
      List<Order> orders = orderRepository.findTop5ByOrderByCreatedAtDesc();
      orders.forEach(System.out::println);
   }


   @Test
   void last() {
      System.out.println("=======================================");
   }
}
