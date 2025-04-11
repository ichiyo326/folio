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
    private PurchaseService purchaseService;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void purchaseSingleTest() {
        Product product = new Product();
        product.setId(999L);
        product.setName("TestProduct");
        product.setStock(10);
        productRepository.save(product);

        purchaseService.purchaseSingle(999L, 1L, 5);
        Product updated = productRepository.findById(999L).orElseThrow();
        Assertions.assertEquals(5, updated.getStock());
    }
}
