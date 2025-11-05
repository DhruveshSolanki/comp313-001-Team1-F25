package com.feastflow.repository;

import com.feastflow.model.RestaurantMenu;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRestaurantMenuRepository extends MongoRepository<RestaurantMenu,String> {
}
