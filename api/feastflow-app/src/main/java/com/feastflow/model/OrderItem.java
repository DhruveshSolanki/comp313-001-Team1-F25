package com.feastflow.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.feastflow.enums.OrderItemStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder.Default;

@Document(collection = "order_items")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    @Id
    private String orderItemId;

    @DBRef
    @JsonIgnore // avoid recursive serialization: order -> orderItems -> order -> ...
    private Order order;

    @DBRef
    private RestaurantMenu menuItem;

    private Integer quantity;
    private Double price;

    @Default
    private OrderItemStatus itemStatus = OrderItemStatus.PENDING;

    private String note;

    @LastModifiedDate
    @Field("updated_at")
    private Instant updatedAt;
}
