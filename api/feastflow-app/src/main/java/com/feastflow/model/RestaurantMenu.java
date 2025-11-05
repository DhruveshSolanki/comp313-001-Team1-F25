package com.feastflow.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "restaurant_menu")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantMenu {
        @Id
        private String itemId;
        private String itemName;
        private String category;
        private Double price;
        private String description;
        private List<String> allergens;
        private List<String> ingredients;
}
