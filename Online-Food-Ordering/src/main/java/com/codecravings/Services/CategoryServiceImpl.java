package com.codecravings.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codecravings.Repository.CategoryRepository;
import com.codecravings.model.Category;
import com.codecravings.model.Restaurant;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Override
    public Category createCategory(String name, Long userId) throws Exception {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }

        Restaurant restaurant = restaurantService.getRestaurantByUserId(userId);

        if (restaurant == null) {
            throw new Exception("restaurant is not found!");
        }

        Category category = new Category();
        category.setName(name);
        category.setRestaurant(restaurant);

        return categoryRepository.save(category);
    }

    @Override
    public List<Category> findCategoryByRestaurantId(Long id) throws Exception {

        Restaurant restaurant = restaurantService.findRestaurantById(id);

        return categoryRepository.findByRestaurantId(id);
    }

    @Override
    public Category findCategoryById(Long id) {

        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public Category findCategoryByName(String name, Long restaurantId) throws Exception {

        Category category = categoryRepository.findByNameAndRestaurantId(name, restaurantId);

        if (category == null) {
            throw new Exception("Category not found");
        }

        return category;
    }
}