package com.feastflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.feastflow.enums.OrderStatus;
import com.feastflow.model.Order;
import com.feastflow.security.SecurityUtils;
import com.feastflow.service.IOrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@Tag(name = "Order API")
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final IOrderService orderService;

    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    // Customer checkout
    @PostMapping("/checkout")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Checkout current cart into an order (customer)")
    public ResponseEntity<Order> checkout(@RequestParam String tableId) {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(orderService.checkout(email, tableId));
    }

    // List my orders (customer)
    @GetMapping("/mine")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "List my orders")
    public ResponseEntity<java.util.List<Order>> myOrders() {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(orderService.list(null, true, email));
    }

    // Staff list with optional status filter
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CHEF','SERVER')")
    @Operation(summary = "List orders (staff) optionally filtered by status")
    public ResponseEntity<java.util.List<Order>> list(@RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(orderService.list(status, false, null));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CHEF','SERVER','CUSTOMER')")
    @Operation(summary = "Get single order (customer can access own only - enforced in frontend for now)")
    public ResponseEntity<Order> get(@PathVariable String id) {
        return ResponseEntity.ok(orderService.get(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CHEF','SERVER')")
    @Operation(summary = "Update order status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        OrderStatus newStatus = OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateStatus(id, newStatus));
    }

    @PutMapping("/{orderId}/items/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','CHEF','SERVER')")
    @Operation(summary = "Update order item (quantity, note, itemStatus)")
    public ResponseEntity<Order> updateItem(@PathVariable String orderId,
                                            @PathVariable String itemId,
                                            @RequestBody Map<String, Object> body) {
        Integer quantity = body.get("quantity") != null ? ((Number) body.get("quantity")).intValue() : null;
        String note = (String) body.get("note");
        String itemStatus = (String) body.get("itemStatus");
        return ResponseEntity.ok(orderService.updateOrderItem(orderId, itemId, quantity, note, itemStatus));
    }

    @GetMapping("/dashboardSummary")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Order dashboard summary (counts and placeholder revenue)")
    public ResponseEntity<IOrderService.OrderSummary> summary() {
        return ResponseEntity.ok(orderService.dashboardSummary());
    }
}
