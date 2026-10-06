package com.codecravings.Services;

import java.util.List;

import com.codecravings.model.IngrediantsCategory;
import com.codecravings.model.IngrediantsItem;

public interface IngrediantService {

    public IngrediantsCategory createIngrediantCategory(String name, Long restaurantId) throws Exception;

    public IngrediantsCategory findIngrediantsCategoryById(Long id) throws Exception;

    public List<IngrediantsCategory> findIngrediantsCategoriesByRestaurantId(Long id) throws Exception;

    public IngrediantsItem createIngrediantsItem(Long restaurantId, String ingrediantName, Long categoryId)
            throws Exception;

    public List<IngrediantsItem> findRestaurantIngrediants(Long restaurantId);

    public IngrediantsItem updateStock(Long id) throws Exception;

    public void deleteIngrediantCategory(Long id) throws Exception;
}
