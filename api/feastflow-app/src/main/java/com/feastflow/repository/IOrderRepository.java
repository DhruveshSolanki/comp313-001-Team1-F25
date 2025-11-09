package com.feastflow.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.feastflow.enums.OrderStatus;
import com.feastflow.model.Order;

@Repository
public interface IOrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomer_CustomerEmail(String customerEmail);
    List<Order> findByStatusOrderByCreatedAtAsc(OrderStatus status);
    List<Order> findAllByOrderByCreatedAtAsc();
    long countByStatus(OrderStatus status);
}
