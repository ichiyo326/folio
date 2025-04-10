package com.example.ecinventory.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.ecinventory.repository.OrderRepository;
import com.example.ecinventory.repository.OrderItemRepository;
import com.example.ecinventory.repository.ProductRepository;
import com.example.ecinventory.entity.Order;
import com.example.ecinventory.entity.OrderItem;
import com.example.ecinventory.entity.Product;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public PurchaseService(ProductRepository productRepository,
                           OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional
    public void purchaseSingle(Long productId, Long userId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("商品未登録"));

        int newStock = product.getStock() - quantity;
        if (newStock < 0) {
            throw new RuntimeException("在庫不足");
        }
        product.setStock(newStock);
        productRepository.save(product);

        Order order = new Order();
        order.setOrderId(generateId());
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        orderRepository.save(order);

        OrderItem item = new OrderItem();
        item.setOrderItemId(generateId());
        item.setOrderId(order.getOrderId());
        item.setProductId(productId);
        item.setQuantity(quantity);
        orderItemRepository.save(item);
    }

    @Transactional
    public void purchaseMultiple(List<Long> productIds, Long userId, List<Integer> quantities) {
        if (productIds.size() != quantities.size()) {
            throw new RuntimeException("数量指定不整合");
        }

        Order order = new Order();
        order.setOrderId(generateId());
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        orderRepository.save(order);

        for (int i = 0; i < productIds.size(); i++) {
            Long pid = productIds.get(i);
            int qty = quantities.get(i);

            Product product = productRepository.findById(pid)
                    .orElseThrow(() -> new RuntimeException("商品未登録"));

            int newStock = product.getStock() - qty;
            if (newStock < 0) {
                throw new RuntimeException("在庫不足");
            }
            product.setStock(newStock);
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrderItemId(generateId());
            item.setOrderId(order.getOrderId());
            item.setProductId(pid);
            item.setQuantity(qty);
            orderItemRepository.save(item);
        }
    }

    private Long generateId() {
        return System.currentTimeMillis();
    }
}
