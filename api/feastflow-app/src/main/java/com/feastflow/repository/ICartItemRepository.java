package com.feastflow.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.feastflow.model.CartItem;

public interface ICartItemRepository extends MongoRepository<CartItem, Long> {
}

