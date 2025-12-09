package com.feastflow.repository;

import java.util.Optional;

import com.feastflow.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICartRepository extends MongoRepository<Cart, String> {
	Optional<Cart> findByCustomerEmail(String email);
}

