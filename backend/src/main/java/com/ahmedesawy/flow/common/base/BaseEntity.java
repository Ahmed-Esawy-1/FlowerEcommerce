package com.ahmedesawy.flow.common.base;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;


@MappedSuperclass
@Getter
@Setter
public class BaseEntity {
   @CreationTimestamp
   @Column(nullable = false, updatable = false)
   private LocalDateTime createdAt;

   @UpdateTimestamp
   private LocalDateTime updatedAt;

   private LocalDateTime deletedAt;
   
}

