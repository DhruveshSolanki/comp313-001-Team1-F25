package com.feastflow.service;

import java.util.List;

import com.feastflow.enums.OrderStatus;
import com.feastflow.model.Order;

public interface IOrderService {
    Order checkout(String customerEmail, String tableId, String notes);
    List<Order> list(String status, boolean onlyMine, String customerEmail);
    Order updateStatus(String orderId, OrderStatus newStatus);
    Order updateOrderItem(String orderId, String orderItemId, Integer quantity, String note, String itemStatus);
    Order get(String orderId);

    // Minimal dashboard summary DTO as nested static class to avoid creating new file now
    class OrderSummary {
        public long placed;
        public long preparing;
        public long ready;
        public long served;
        public double revenueToday; // placeholder; requires date range calc later
    }
    OrderSummary dashboardSummary();
}
