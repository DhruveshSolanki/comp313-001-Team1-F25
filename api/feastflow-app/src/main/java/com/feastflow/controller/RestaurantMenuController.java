package com.feastflow.controller;

import com.feastflow.model.RestaurantMenu;
import com.feastflow.service.IRestaurantMenuService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@Tag(name = "Restaurant Menu API", description = "API for managing restaurant menu items")
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/restaurantmenu")
public class RestaurantMenuController {

    @Autowired
    private IRestaurantMenuService restaurantMenuService;

    @GetMapping
    @Operation(summary = "Get all restaurant menu items", description = "Returns a list of all menu items")
    public ResponseEntity<List<RestaurantMenu>> getAllMenuItems() {
        return ResponseEntity.ok(restaurantMenuService.getAllMenuItems());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get menu item by ID", description = "Returns a menu item by its ID")
    public ResponseEntity<Optional<RestaurantMenu>> getMenuItemById(@PathVariable String id) {
        return ResponseEntity.ok(restaurantMenuService.getMenuItemById(id));
    }

    @PostMapping
    @Operation(summary = "Add a new menu item", description = "Creates a new menu item")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<RestaurantMenu> addMenuItem(@RequestBody RestaurantMenu restaurantMenu) {
        return ResponseEntity.ok(restaurantMenuService.saveMenuItem(restaurantMenu));
    }

    @PutMapping
    @Operation(summary = "Update a menu item", description = "Updates an existing menu item")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<RestaurantMenu> updateMenuItem(@RequestBody RestaurantMenu restaurantMenu) {
        return ResponseEntity.ok(restaurantMenuService.updateMenuItem(restaurantMenu.getItemId(), restaurantMenu));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a menu item", description = "Deletes a menu item by its ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RestaurantMenu> deleteMenuItem(@PathVariable String id) {
        return ResponseEntity.ok(restaurantMenuService.deleteMenuItem(id));
    }
}
