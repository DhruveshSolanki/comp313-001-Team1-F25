package com.feastflow.dto;

import com.feastflow.enums.RestaurantStaffRole;
import com.feastflow.enums.RestaurantStaffStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestaurantStaffResponse {
    private String staffId;
    private String staffName;
    private String staffEmail;
    private String staffPhoneNumber;
    private RestaurantStaffRole role;
    private RestaurantStaffStatus status;
}
