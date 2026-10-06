package com.codecravings.Services;

import java.util.List;

import com.codecravings.model.Category;
import com.codecravings.model.Food;
import com.codecravings.model.Restaurant;
import com.codecravings.request.CreateFoodReq;

public interface FoodService {
    public Food createFood(CreateFoodReq req, Restaurant restaurant, Category category) throws Exception;

    void deleteFood(Long foodId) throws Exception;

    public List<Food> getRestaurantFood(Long restaurantId,
            boolean isVegeterian,
            boolean isNonveg,
            boolean isSeasional,
            String foodCategory) throws Exception;

    public List<Food> searchFood(String keyword);

    public Food findFoodById(Long foodId) throws Exception;

    public Food updateAvailibilityStatus(Long foodId) throws Exception;


    List<Food> getAllAvailableFoods();

    Food updateFood(Long foodId, CreateFoodReq req) throws Exception;

}
