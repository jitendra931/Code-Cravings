package com.codecravings.request;

import java.util.List;

import com.codecravings.model.Category;
import com.codecravings.model.IngrediantsItem;

import lombok.Data;

@Data
public class CreateFoodReq {
    private Long id;
    private String name;
    private String description;
    private Long price;

    private Category category;
    private List<String> images;

    private Long restaurantId;
    private boolean vegetarian;

    private boolean seasonal;

    private List<IngrediantsItem> ingrediants;
}
