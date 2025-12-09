package com.feastflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.feastflow.model.RestaurantTable;
import com.feastflow.service.IRestaurantTableService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Restaurant Table API", description = "API for managing restaurant tables")
@RestController
@RequestMapping("/api/v1/restauranttables")
public class RestaurantTableController {

    @Autowired
    private IRestaurantTableService restaurantTableService;

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> listAll() {
        List<RestaurantTable> tables = restaurantTableService.findAll();
        return ResponseEntity.ok(tables);
    }
}
