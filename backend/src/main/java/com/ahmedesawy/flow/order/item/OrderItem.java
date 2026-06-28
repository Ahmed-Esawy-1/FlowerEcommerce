package com.ahmedesawy.flow.order.item;

import java.math.BigDecimal;

import com.ahmedesawy.flow.order.Order;
import com.ahmedesawy.flow.product.Product;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "order_id")
  @JsonBackReference
  private Order order;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = true)
  private Product product;

  private Integer quantity;
  private BigDecimal price;

}
