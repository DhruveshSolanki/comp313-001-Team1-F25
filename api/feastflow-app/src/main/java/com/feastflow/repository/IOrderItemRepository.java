package com.feastflow.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.feastflow.model.OrderItem;

@Repository
public interface IOrderItemRepository extends MongoRepository<OrderItem, String> {
    List<OrderItem> findByOrder_OrderId(String orderId);
}
