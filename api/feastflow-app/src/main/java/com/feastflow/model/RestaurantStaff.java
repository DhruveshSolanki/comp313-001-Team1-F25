package com.feastflow.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.feastflow.enums.RestaurantStaffRole;
import com.feastflow.enums.RestaurantStaffStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection = "restaurant_staff")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantStaff {
    @Id
    private String staffId;

    private String staffName;
    private String staffEmail;
    private String staffPassword;
    private String staffPhoneNumber;

    private RestaurantStaffRole role;

    private RestaurantStaffStatus status;
}
