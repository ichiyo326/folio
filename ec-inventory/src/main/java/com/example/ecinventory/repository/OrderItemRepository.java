package com.example.ecinventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecinventory.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
