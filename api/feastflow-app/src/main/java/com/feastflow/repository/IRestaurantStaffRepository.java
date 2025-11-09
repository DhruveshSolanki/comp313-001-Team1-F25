package com.feastflow.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.feastflow.model.RestaurantStaff;

@Repository
public interface IRestaurantStaffRepository extends MongoRepository<RestaurantStaff, String> {
	Optional<RestaurantStaff> findByStaffEmail(String staffEmail);
}
