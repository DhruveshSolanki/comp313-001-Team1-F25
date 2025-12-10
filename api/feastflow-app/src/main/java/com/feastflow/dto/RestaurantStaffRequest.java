package com.feastflow.dto;

import com.feastflow.enums.RestaurantStaffRole;
import com.feastflow.enums.RestaurantStaffStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RestaurantStaffRequest {
    @NotBlank(message = "Staff name is required")
    private String staffName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String staffEmail;

    @NotBlank(message = "Password is required")
    private String staffPassword;

    // Basic phone validation; adapt as needed
    @Pattern(regexp = "^[0-9+\\-() ]{7,20}$", message = "Invalid phone number")
    private String staffPhoneNumber;

    private RestaurantStaffRole role;
    private RestaurantStaffStatus status;
}
