package com.feastflow.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.feastflow.enums.OrderStatus;
import com.feastflow.enums.OrderItemStatus;
import com.feastflow.model.Cart;
import com.feastflow.model.CartItem;
import com.feastflow.model.Customer;
import com.feastflow.model.Order;
import com.feastflow.model.OrderItem;
import com.feastflow.model.RestaurantTable;
import com.feastflow.repository.ICartItemRepository;
import com.feastflow.repository.ICartRepository;
import com.feastflow.repository.ICustomerRepository;
import com.feastflow.repository.IOrderRepository;
import com.feastflow.repository.IOrderItemRepository;
import com.feastflow.repository.IRestaurantTableRepository;
import com.feastflow.service.IOrderService;

@Service
@Transactional
public class OrderService implements IOrderService {

    private final ICartRepository cartRepo;
    private final ICartItemRepository cartItemRepo;
    private final ICustomerRepository customerRepo;
    private final IOrderRepository orderRepo;
        private final IRestaurantTableRepository tableRepo;
        private final IOrderItemRepository orderItemRepo;

    public OrderService(ICartRepository cartRepo,
                        ICartItemRepository cartItemRepo,
                                                ICustomerRepository customerRepo,
                                                IOrderRepository orderRepo,
                                                IRestaurantTableRepository tableRepo,
                                                IOrderItemRepository orderItemRepo) {
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.customerRepo = customerRepo;
        this.orderRepo = orderRepo;
        this.tableRepo = tableRepo;
                this.orderItemRepo = orderItemRepo;
    }

    @Override
    public Order checkout(String customerEmail, String tableId, String notes) {
        // Load customer & cart
        Customer customer = customerRepo.findByCustomerEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + customerEmail));
        Cart cart = cartRepo.findByCustomer_CustomerEmail(customerEmail)
                .orElseThrow(() -> new IllegalStateException("Cart is empty or not found for customer."));

        // Load cart items
        List<CartItem> cartItems = cartItemRepo.findByCart_CartId(cart.getCartId());
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cannot checkout with empty cart.");
        }

        // Compute total
        double total = cartItems.stream()
                .mapToDouble(ci -> ci.getQuantity() * (ci.getMenuItem().getPrice() != null ? ci.getMenuItem().getPrice() : 0.0))
                .sum();

        // Optional table
        RestaurantTable table = null;
        if (tableId != null && !tableId.isBlank()) {
            table = tableRepo.findById(tableId)
                    .orElseThrow(() -> new IllegalArgumentException("Table not found: " + tableId));
        }

        // Build order items (detached from cart)
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            orderItems.add(OrderItem.builder()
                    .menuItem(ci.getMenuItem())
                    .quantity(ci.getQuantity())
                    .price(ci.getMenuItem().getPrice())
                    .note(ci.getNote())
                    .build());
        }

        Order order = Order.builder()
                .customer(customer)
                .table(table)
                .orderItems(orderItems)
                .status(OrderStatus.PLACED)
                .notes(notes)
                .totalAmount(total)
                .build();

                // Persist order first
                order = orderRepo.save(order);

                // Persist order items with back-reference
                        for (OrderItem oi : orderItems) {
                        oi.setOrder(order);
                        orderItemRepo.save(oi);
                }
                // Refresh list with persisted instances
                order.setOrderItems(orderItems);
                        order = orderRepo.save(order);

        // Clear cart
        cartItemRepo.deleteAll(cartItems);

        return order;
    }

        @Override
        public List<Order> list(String status, boolean onlyMine, String customerEmail) {
                if (onlyMine && customerEmail != null) {
                        return orderRepo.findByCustomer_CustomerEmail(customerEmail);
                }
                if (status != null && !status.isBlank()) {
                        OrderStatus s = OrderStatus.valueOf(status);
                        return orderRepo.findByStatusOrderByCreatedAtAsc(s);
                }
                return orderRepo.findAllByOrderByCreatedAtAsc();
        }

        @Override
        public Order updateStatus(String orderId, OrderStatus newStatus) {
                Order order = orderRepo.findById(orderId)
                                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
                order.setStatus(newStatus);
                return orderRepo.save(order);
        }

        @Override
        public Order updateOrderItem(String orderId, String orderItemId, Integer quantity, String note, String itemStatus) {
                Order order = orderRepo.findById(orderId)
                                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
                if (order.getOrderItems() == null) {
                        throw new IllegalStateException("Order has no items");
                }
                OrderItem target = order.getOrderItems().stream()
                                .filter(oi -> Objects.equals(oi.getOrderItemId(), orderItemId))
                                .findFirst()
                                .orElseThrow(() -> new IllegalArgumentException("Order item not found: " + orderItemId));

                if (quantity != null && quantity > 0) target.setQuantity(quantity);
                if (note != null) target.setNote(note);
                if (itemStatus != null) target.setItemStatus(OrderItemStatus.valueOf(itemStatus));

                // Persist the item itself
                orderItemRepo.save(target);

                // Recalculate total using latest list from DB
                List<OrderItem> items = orderItemRepo.findByOrder_OrderId(order.getOrderId());
                order.setOrderItems(items);
                double total = items.stream()
                        .mapToDouble(oi -> (oi.getPrice() != null ? oi.getPrice() : 0.0) * (oi.getQuantity() != null ? oi.getQuantity() : 0))
                        .sum();
                order.setTotalAmount(total);

                return orderRepo.save(order);
        }

        @Override
        public Order get(String orderId) {
                return orderRepo.findById(orderId)
                                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        }

        @Override
        public OrderSummary dashboardSummary() {
                OrderSummary s = new OrderSummary();
                s.placed = orderRepo.countByStatus(OrderStatus.PLACED);
                s.preparing = orderRepo.countByStatus(OrderStatus.PREPARING);
                s.ready = orderRepo.countByStatus(OrderStatus.READY);
                s.served = orderRepo.countByStatus(OrderStatus.SERVED);
                s.revenueToday = 0; // placeholder; implement date filter with aggregation later
                return s;
        }
}