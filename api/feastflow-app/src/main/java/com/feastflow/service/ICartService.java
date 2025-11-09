package com.feastflow.service;

import com.feastflow.model.Cart;

public interface ICartService {
    Cart getOrCreateCartForCustomer(String customerEmail);
    Cart addItem(String customerEmail, String menuItemId, int quantity, String note);
    Cart updateItem(String customerEmail, String cartItemId, int quantity, String note);
    Cart removeItem(String customerEmail, String cartItemId);
    Cart clear(String customerEmail);
}
