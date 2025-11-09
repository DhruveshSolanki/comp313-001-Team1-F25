package com.feastflow.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.feastflow.model.Cart;
import com.feastflow.model.CartItem;
import com.feastflow.model.Customer;
import com.feastflow.model.RestaurantMenu;
import com.feastflow.repository.ICartItemRepository;
import com.feastflow.repository.ICartRepository;
import com.feastflow.repository.ICustomerRepository;
import com.feastflow.repository.IRestaurantMenuRepository;
import com.feastflow.service.ICartService;

@Service
@Transactional
public class CartService implements ICartService {

    private final ICartRepository cartRepo;
    private final ICartItemRepository cartItemRepo;
    private final ICustomerRepository customerRepo;
    private final IRestaurantMenuRepository menuRepo;

    public CartService(ICartRepository cartRepo, ICartItemRepository cartItemRepo, ICustomerRepository customerRepo,
            IRestaurantMenuRepository menuRepo) {
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.customerRepo = customerRepo;
        this.menuRepo = menuRepo;
    }

    @Override
    public Cart getOrCreateCartForCustomer(String customerEmail) {
        return cartRepo.findByCustomer_CustomerEmail(customerEmail)
                .orElseGet(() -> {
                    Customer customer = customerRepo.findByCustomerEmail(customerEmail)
                            .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + customerEmail));
                    Cart c = Cart.builder().customer(customer).build();
                    return cartRepo.save(c);
                });
    }

    @Override
    public Cart addItem(String customerEmail, String menuItemId, int quantity, String note) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be > 0");
        Cart cart = getOrCreateCartForCustomer(customerEmail);
        RestaurantMenu menuItem = menuRepo.findById(menuItemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + menuItemId));

        // If item exists in cart, just update quantity
        List<CartItem> items = cartItemRepo.findByCart_CartId(cart.getCartId());
        Optional<CartItem> existing = items.stream().filter(ci -> ci.getMenuItem().getItemId().equals(menuItemId)).findFirst();
        if (existing.isPresent()) {
            CartItem ci = existing.get();
            ci.setQuantity(ci.getQuantity() + quantity);
            if (note != null) ci.setNote(note);
            cartItemRepo.save(ci);
        } else {
            CartItem ci = CartItem.builder().cart(cart).menuItem(menuItem).quantity(quantity).note(note).build();
            cartItemRepo.save(ci);
        }
        return getOrCreateCartForCustomer(customerEmail);
    }

    @Override
    public Cart updateItem(String customerEmail, String cartItemId, int quantity, String note) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be > 0");
        Cart cart = getOrCreateCartForCustomer(customerEmail);
        CartItem item = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + cartItemId));
        if (!item.getCart().getCartId().equals(cart.getCartId())) {
            throw new IllegalArgumentException("Cart item does not belong to current user's cart");
        }
        item.setQuantity(quantity);
        if (note != null) item.setNote(note);
        cartItemRepo.save(item);
        return getOrCreateCartForCustomer(customerEmail);
    }

    @Override
    public Cart removeItem(String customerEmail, String cartItemId) {
        Cart cart = getOrCreateCartForCustomer(customerEmail);
        cartItemRepo.findById(cartItemId).ifPresent(ci -> {
            if (ci.getCart() != null && cart.getCartId().equals(ci.getCart().getCartId())) {
                cartItemRepo.delete(ci);
            }
        });
        return getOrCreateCartForCustomer(customerEmail);
    }

    @Override
    public Cart clear(String customerEmail) {
        Cart cart = getOrCreateCartForCustomer(customerEmail);
        List<CartItem> items = cartItemRepo.findByCart_CartId(cart.getCartId());
        cartItemRepo.deleteAll(items);
        return getOrCreateCartForCustomer(customerEmail);
    }
}
