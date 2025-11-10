package com.feastflow.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder.Default;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payments")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    private String paymentId;

    @DBRef
    private Order order;

    private Double amount;
    private String method; // CASH, CARD, ONLINE

    @Default
    private Boolean paid = false;

    private LocalDateTime paymentTime;
}
