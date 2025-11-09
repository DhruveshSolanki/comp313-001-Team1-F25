package com.feastflow.repository;

import com.feastflow.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ICartRepository extends MongoRepository<Cart,Long> {
}

