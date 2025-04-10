package com.example.ecinventory.controller;

import org.springframework.web.bind.annotation.*;
import com.example.ecinventory.repository.ProductRepository;
import com.example.ecinventory.entity.Product;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findAll();
    }
}
