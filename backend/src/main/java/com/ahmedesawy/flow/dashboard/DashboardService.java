package com.ahmedesawy.flow.dashboard;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.flow.category.CategoryRepository;
import com.ahmedesawy.flow.dashboard.dto.DashboardResponseDTO;
import com.ahmedesawy.flow.dashboard.dto.DashboardStatsDTO;
import com.ahmedesawy.flow.dashboard.dto.LatestOrderDTO;
import com.ahmedesawy.flow.dashboard.dto.TopProductDTO;
import com.ahmedesawy.flow.occasion.OccasionRepository;
import com.ahmedesawy.flow.order.OrderRepository;
import com.ahmedesawy.flow.order.OrderStatus;
import com.ahmedesawy.flow.product.ProductRepository;

@Service
@RequiredArgsConstructor
public class DashboardService {

   private final CategoryRepository categoryRepository;
   private final OccasionRepository occasionRepository;
   private final ProductRepository productRepository;
   private final OrderRepository orderRepository;


   @Transactional(readOnly = true)
   public DashboardResponseDTO getDashboardData(Integer year) {

      int targetYear = (year != null) ? year : Year.now().getValue();

      //  Stats 
      BigDecimal yearlyRevenue = orderRepository
            .sumRevenueByStatusAndYear(OrderStatus.DELIVERED, targetYear)
            .setScale(2, RoundingMode.HALF_UP);

      DashboardStatsDTO stats = new DashboardStatsDTO(
         categoryRepository.count(),
         occasionRepository.count(),
         productRepository.count(),
         orderRepository.count(),
         orderRepository.countByStatus(OrderStatus.DELIVERED),
         orderRepository.countByStatus(OrderStatus.PENDING),
         targetYear,
         yearlyRevenue
      );

      // Latest 5 Orders 
      List<LatestOrderDTO> latestOrders = orderRepository
            .findTop5ByOrderByCreatedAtDesc()
            .stream()
            .map(order -> new LatestOrderDTO(
                        order.getId(),
                        order.getUser().getUserName(),
                        order.getTotalPrice(),
                        order.getStatus().name(),
                        order.getCreatedAt()
                     )
            )
            .toList();

      //  Top 5 On-Demand Products 
      List<TopProductDTO> topProducts = orderRepository
            .findTop5ProductsByOrderCount(PageRequest.of(0, 5))
            .stream()
            .map(row ->  new TopProductDTO(
                     (Long) row[0],
                     (String) row[1],
                     (Long) row[2]
                  )
            )
            .toList();


      return new DashboardResponseDTO(
         stats,
         latestOrders,
         topProducts
      );
   }
}