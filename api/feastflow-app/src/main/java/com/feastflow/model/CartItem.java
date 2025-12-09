package com.feastflow.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "cart_items")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    @Id
    private String cartItemId;

    @DBRef
    @JsonIgnore // avoid recursive serialization of cart -> cartItems -> cart
    private Cart cart;

    @DBRef
    private RestaurantMenu menuItem;

    private Integer quantity;

    private String note;
}