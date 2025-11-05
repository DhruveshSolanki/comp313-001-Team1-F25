package com.feastflow.service;

import com.feastflow.model.RestaurantMenu;

import java.util.List;
import java.util.Optional;

public interface IRestaurantMenuService {
    RestaurantMenu saveMenuItem(RestaurantMenu menuItem);

    List<RestaurantMenu> getAllMenuItems();
    Optional<RestaurantMenu> getMenuItemById(String id);

    RestaurantMenu updateMenuItem(String id, RestaurantMenu updatedItem);

    RestaurantMenu deleteMenuItem(String id);
}
