package com.feastflow.repository;

import com.feastflow.model.RestaurantStaff;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantStaffRepository extends MongoRepository<RestaurantStaff, String> {
    boolean existsByStaffEmail(String staffEmail);
}
