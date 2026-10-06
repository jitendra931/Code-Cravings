package com.codecravings.request;

import lombok.Data;

@Data
public class IngrediantCategoryRequest {
    private String name;
    private Long restaurantId;
    private Long categoryId;

}
