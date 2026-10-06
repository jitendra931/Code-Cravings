package com.codecravings.request;

import lombok.Data;

@Data
public class IngrediantReq {
    private String name;

    private Long categoryId;

    private Long restaurantId;

}
