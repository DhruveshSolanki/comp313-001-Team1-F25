package com.feastflow.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "customer")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Customer {
    @Id
    private String customerId;

    private String customerName;
    private String customerEmail;
    @JsonIgnore // prevent exposing hashed password in API responses
    private String customerPassword;
    private String customerPhoneNumber;
}
