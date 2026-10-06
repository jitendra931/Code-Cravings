package com.codecravings.Services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.codecravings.model.Category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codecravings.Repository.FoodRepository;
import com.codecravings.Repository.OrderItemRepository;
import com.codecravings.model.Food;
import com.codecravings.model.Restaurant;
import com.codecravings.request.CreateFoodReq;

@Service
public class FoodServiceImpt implements FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public Food createFood(CreateFoodReq req, Restaurant restaurant, Category category) {

        if (req.getName() == null || req.getPrice() == null) {
            throw new IllegalArgumentException("Food name and price are required");
        }

        if (restaurant == null || category == null) {
            throw new IllegalArgumentException("Restaurant or Category not found");
        }

        Food food = new Food();

        food.setName(req.getName());
        food.setDescription(req.getDescription());
        food.setPrice(req.getPrice());

        food.setImages(req.getImages());
        food.setIngrediants(req.getIngrediants());

        food.setFoodCategory(category);
        food.setRestaurant(restaurant);

        food.setAvailable(true);

        food.setSeasonal(req.isSeasonal());
        food.setVegetarian(req.isVegetarian());

        food.setCreationDate(new java.sql.Date(System.currentTimeMillis()));

        return foodRepository.save(food);
    }

    @Override
    public void deleteFood(Long foodId) throws Exception {

        Food food = findFoodById(foodId);

        boolean usedInOrder = orderItemRepository.existsByFoodId(foodId);

        if (usedInOrder) {
            throw new IllegalStateException(
                    "This food cannot be deleted because it has already been ordered. Mark it unavailable instead.");
        }

        foodRepository.delete(food);
    }

    @Override
    public List<Food> getRestaurantFood(Long restaurantId, boolean isVegeterian, boolean isNonveg, boolean isSeasonal,
            String foodCategory) throws Exception {

        List<Food> foods = foodRepository.findByRestaurantId(restaurantId);
        if (isVegeterian) {
            foods = filterByVegetarian(foods, isVegeterian);
        }

        if (isSeasonal) {
            foods = filterBySeasonal(foods, isSeasonal);
        }

        if (isNonveg) {
            foods = filterByNonveg(foods, isNonveg);
        }

        if (foodCategory != null && !foodCategory.isBlank()) {
            foods = filterByCategory(foods, foodCategory);
        }

        return foods;
    }

    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {

        if (foodCategory == null || foodCategory.isBlank()) {
            return foods;
        }

        return foods.stream()
                .filter(food -> food.getFoodCategory() != null &&
                        food.getFoodCategory().getName() != null &&
                        food.getFoodCategory().getName().equalsIgnoreCase(foodCategory))
                .toList();
    }

    private List<Food> filterByNonveg(List<Food> foods, boolean isNonveg) {
        if (!isNonveg) {
            return foods;
        }

        return foods.stream().filter(food -> !food.isVegetarian()).collect(Collectors.toList());
    }

    private List<Food> filterBySeasonal(List<Food> foods, boolean isSeasonal) {
        if (!isSeasonal) {
            return foods;
        }

        return foods.stream().filter(food -> food.isSeasonal() == isSeasonal).collect(Collectors.toList());
    }

    private List<Food> filterByVegetarian(List<Food> foods, boolean isVegeterian) {
        if (!isVegeterian) {
            return foods;
        }
        return foods.stream().filter(food -> food.isVegetarian() == isVegeterian).collect(Collectors.toList());
    }

    @Override
    public List<Food> searchFood(String keyword) {
        return foodRepository.searchFood(keyword);
    }

    @Override
    public Food findFoodById(Long foodId) throws Exception {
        Optional<Food> optionalFood = foodRepository.findById(foodId);

        if (optionalFood.isEmpty()) {
            throw new Exception("Food not found!");
        }

        return optionalFood.get();
    }

    @Override
    public Food updateAvailibilityStatus(Long foodId) throws Exception {
        Food food = findFoodById(foodId);
        food.setAvailable(!food.isAvailable());

        return foodRepository.save(food);
    }


    @Override
public List<Food> getAllAvailableFoods() {
    return foodRepository.findByAvailableTrue();
}

@Override
public Food updateFood(Long foodId, CreateFoodReq req) throws Exception {
    Food food = findFoodById(foodId);

    if (req.getName() == null || req.getPrice() == null) {
        throw new IllegalArgumentException("Food name and price are required");
    }

    food.setName(req.getName());
    food.setDescription(req.getDescription());
    food.setPrice(req.getPrice());
    food.setImages(req.getImages());
    food.setIngrediants(req.getIngrediants());
    food.setSeasonal(req.isSeasonal());
    food.setVegetarian(req.isVegetarian());

    return foodRepository.save(food);
}
}
