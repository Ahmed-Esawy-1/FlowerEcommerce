package com.ecommerce.dashboard.model;

import java.security.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;
  private Double totalPrice;
  private String status;
  private String paymentMethod;
  @Column(columnDefinition = "TEXT")
  private String shippingAddress;

  @JsonManagedReference
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
  private List<OrderItem> items;

  @CreationTimestamp
  private LocalDateTime createdAt;
  @UpdateTimestamp
  private LocalDateTime updatedAt;

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }
  public void setUser(User user) {
    this.user = user;
  }

  public Double getTotalPrice() {
    return totalPrice;
  }
  public void setTotalPrice(Double totalPrice) {
    this.totalPrice = totalPrice;
  }
  
  public String getStatus() {
    return status;
  }
  public void setStatus(String status) {
    this.status = status;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }
  public void setPaymentMethod(String paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public String getShippingAddress() {
    return shippingAddress;
  }
  public void setShippingAddress(String shippingAddress) {
    this.shippingAddress = shippingAddress;
  }
  
  public List<OrderItem> getItems() {
    return items;
  }
  public void setItems(List<OrderItem> items) {
    this.items = items;
  }


  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }
  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  

  
}
