package com.example.ecinventory;

import com.example.ecinventory.entity.Product;
import com.example.ecinventory.repository.ProductRepository;
import com.example.ecinventory.service.PurchaseService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class PurchaseServiceTest {

    @Autowired
    PurchaseService purchaseService;

    @Autowired
    ProductRepository productRepository;

    @Test
    void purchaseSingleTest() {
        Product p = new Product();
        p.setId(999L);
        p.setName("TestProduct");
        p.setStock(10);
        productRepository.save(p);

        purchaseService.purchaseSingle(999L, 1L, 5);

        Product updated = productRepository.findById(999L)
                .orElseThrow(() -> new RuntimeException("商品なし"));
        Assertions.assertEquals(5, updated.getStock());
    }
}
