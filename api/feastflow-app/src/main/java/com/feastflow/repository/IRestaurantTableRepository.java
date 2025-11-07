package com.feastflow.repository;
import com.feastflow.model.RestaurantTable;
import org.springframework.data.jpa.repository.MongoRepository;

public interface IRestaurantTableRepository extends MongoRepository<RestaurantTable, Long> {
}