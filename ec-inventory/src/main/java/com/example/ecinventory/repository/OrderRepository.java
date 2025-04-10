package com.example.ecinventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecinventory.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
