package com.feastflow.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.feastflow.enums.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "restaurant_table")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantTable {
    @Id
    private String tableId;

    private int tableNumber;
    private int seatingCapacity;
    private TableStatus status;
}