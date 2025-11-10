package com.feastflow.repository;

import java.util.Optional;

import com.feastflow.model.Cart;
import com.feastflow.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICartRepository extends MongoRepository<Cart, String> {
	// Query by DBRef association directly (supported) instead of nested properties (not supported)
	Optional<Cart> findByCustomer(Customer customer);
}

