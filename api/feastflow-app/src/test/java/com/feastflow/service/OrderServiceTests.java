package com.feastflow.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import com.feastflow.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.feastflow.enums.OrderStatus;
import com.feastflow.model.Cart;
import com.feastflow.model.CartItem;
import com.feastflow.model.Customer;
import com.feastflow.model.Order;
import com.feastflow.model.RestaurantMenu;
import com.feastflow.model.RestaurantTable;

public class OrderServiceTests {

    private ICartRepository cartRepo;
    private ICartItemRepository cartItemRepo;
    private ICustomerRepository customerRepo;
    private IOrderRepository orderRepo;

    private IOrderItemRepository orderItem;
    private IRestaurantTableRepository tableRepo;
    private IOrderService orderService;

    @BeforeEach
    void setUp() {
        cartRepo = mock(ICartRepository.class);
        cartItemRepo = mock(ICartItemRepository.class);
        customerRepo = mock(ICustomerRepository.class);
        orderRepo = mock(IOrderRepository.class);
        orderItem = mock(IOrderItemRepository.class);
        tableRepo = mock(IRestaurantTableRepository.class);
        orderService = mock(IOrderService.class);
    }

    @Test
    void checkoutCalculatesTotalAndClearsCart() {
        Customer cust = Customer.builder().customerEmail("cust@example.com").customerPassword("pw").build();
    Cart cart = Cart.builder().cartId("cart1").customerEmail("cust@example.com").build();
        RestaurantMenu menu1 = RestaurantMenu.builder().itemId("m1").price(10.0).itemName("Item1").build();
        RestaurantMenu menu2 = RestaurantMenu.builder().itemId("m2").price(5.5).itemName("Item2").build();
        CartItem ci1 = CartItem.builder().cartItemId("ci1").cart(cart).menuItem(menu1).quantity(2).build();
        CartItem ci2 = CartItem.builder().cartItemId("ci2").cart(cart).menuItem(menu2).quantity(1).build();
        RestaurantTable table = RestaurantTable.builder().tableId("t1").build();

        when(customerRepo.findByCustomerEmail("cust@example.com")).thenReturn(Optional.of(cust));
    when(cartRepo.findByCustomerEmail("cust@example.com")).thenReturn(Optional.of(cart));
        when(cartItemRepo.findByCart_CartId("cart1")).thenReturn(List.of(ci1, ci2));
        when(tableRepo.findById("t1")).thenReturn(Optional.of(table));
        when(orderRepo.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order order = orderService.checkout("cust@example.com", "t1");
        assertNotNull(order);
        assertEquals(OrderStatus.PLACED, order.getStatus());
        assertEquals(10.0 * 2 + 5.5 * 1, order.getTotalAmount());
        verify(cartItemRepo).deleteAll(any());
    }

    @Test
    void checkoutEmptyCartFails() {
        Customer cust = Customer.builder().customerEmail("cust@example.com").build();
    Cart cart = Cart.builder().cartId("cart1").customerEmail("cust@example.com").build();
        when(customerRepo.findByCustomerEmail("cust@example.com")).thenReturn(Optional.of(cust));
    when(cartRepo.findByCustomerEmail("cust@example.com")).thenReturn(Optional.of(cart));
        when(cartItemRepo.findByCart_CartId("cart1")).thenReturn(List.of());

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                orderService.checkout("cust@example.com", null));
        assertTrue(ex.getMessage().contains("empty cart"));
    }
}
