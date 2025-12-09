package com.feastflow.service;

import java.util.List;

import com.feastflow.model.RestaurantTable;

public interface IRestaurantTableService {
    List<RestaurantTable> findAll();
}
