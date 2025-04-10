package com.example.ecinventory.controller;

import org.springframework.web.bind.annotation.*;
import com.example.ecinventory.service.PurchaseService;
import java.util.List;

@RestController
@RequestMapping("/api/purchase")
@CrossOrigin(origins = "http://localhost:3000") // 必要に応じて設定
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping("/single")
    public String purchaseSingle(@RequestParam Long productId,
                                 @RequestParam Long userId,
                                 @RequestParam int quantity) {
        purchaseService.purchaseSingle(productId, userId, quantity);
        return "OK";
    }

    @PostMapping("/multiple")
    public String purchaseMultiple(@RequestBody PurchaseRequest request) {
        purchaseService.purchaseMultiple(
                request.getProductIds(),
                request.getUserId(),
                request.getQuantities()
        );
        return "OK";
    }
}

class PurchaseRequest {
    private Long userId;
    private List<Long> productIds;
    private List<Integer> quantities;

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getProductIds() {
        return productIds;
    }
    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }

    public List<Integer> getQuantities() {
        return quantities;
    }
    public void setQuantities(List<Integer> quantities) {
        this.quantities = quantities;
    }
}
