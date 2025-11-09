package com.feastflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.feastflow.model.Cart;
import com.feastflow.security.SecurityUtils;
import com.feastflow.service.ICartService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@Tag(name = "Cart API")
@RestController
@RequestMapping("/api/v1/cart")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final ICartService cartService;

    public CartController(ICartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get my cart")
    public ResponseEntity<Cart> getMyCart() {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(cartService.getOrCreateCartForCustomer(email));
    }

    @PostMapping("/me/items")
    @Operation(summary = "Add item to my cart")
    public ResponseEntity<Cart> addItem(@RequestBody Map<String, Object> body) {
        String email = SecurityUtils.getCurrentUserEmail();
        String menuItemId = (String) body.get("menuItemId");
        int quantity = ((Number) body.getOrDefault("quantity", 1)).intValue();
        String note = (String) body.get("note");
        return ResponseEntity.ok(cartService.addItem(email, menuItemId, quantity, note));
    }

    @PutMapping("/me/items/{cartItemId}")
    @Operation(summary = "Update item quantity in my cart")
    public ResponseEntity<Cart> updateItem(@PathVariable String cartItemId, @RequestBody Map<String, Object> body) {
        String email = SecurityUtils.getCurrentUserEmail();
        int quantity = ((Number) body.getOrDefault("quantity", 1)).intValue();
        String note = (String) body.get("note");
        return ResponseEntity.ok(cartService.updateItem(email, cartItemId, quantity, note));
    }

    @DeleteMapping("/me/items/{cartItemId}")
    @Operation(summary = "Remove item from my cart")
    public ResponseEntity<Cart> removeItem(@PathVariable String cartItemId) {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(cartService.removeItem(email, cartItemId));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Clear my cart")
    public ResponseEntity<Cart> clear() {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(cartService.clear(email));
    }
}
