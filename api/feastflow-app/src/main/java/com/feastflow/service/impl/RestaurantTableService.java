package com.feastflow.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.feastflow.model.RestaurantTable;
import com.feastflow.repository.IRestaurantTableRepository;
import com.feastflow.service.IRestaurantTableService;

@Service
public class RestaurantTableService implements IRestaurantTableService {

    @Autowired
    private IRestaurantTableRepository restaurantTableRepository;

    @Override
    public List<RestaurantTable> findAll() {
        return restaurantTableRepository.findAll();
    }
}
