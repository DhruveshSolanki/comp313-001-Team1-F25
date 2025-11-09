package com.feastflow.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.feastflow.model.Customer;

@Repository
public interface ICustomerRepository extends MongoRepository<Customer, String> {
}
