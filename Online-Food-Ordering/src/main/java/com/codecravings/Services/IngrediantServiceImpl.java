package com.codecravings.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codecravings.Repository.IngrediantCategoryRepository;
import com.codecravings.Repository.IngrediantItemRepository;
import com.codecravings.model.IngrediantsCategory;
import com.codecravings.model.IngrediantsItem;
import com.codecravings.model.Restaurant;

@Service
public class IngrediantServiceImpl implements IngrediantService {

    @Autowired
    private IngrediantItemRepository ingrediantItemRepository;

    @Autowired
    private IngrediantCategoryRepository ingrediantCategoryRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Override
    public IngrediantsCategory createIngrediantCategory(String name, Long restaurantId) throws Exception {

        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }

        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);

        // duplicate check
        boolean exists = ingrediantCategoryRepository
                .existsByNameAndRestaurant(name, restaurant);

        if (exists) {
            throw new IllegalArgumentException("Category already exists for this restaurant");
        }

        IngrediantsCategory category = new IngrediantsCategory();
        category.setName(name.trim());
        category.setRestaurant(restaurant);

        return ingrediantCategoryRepository.save(category);
    }

    @Override
    public IngrediantsCategory findIngrediantsCategoryById(Long id) throws Exception {
        Optional<IngrediantsCategory> opt = ingrediantCategoryRepository.findById(id);

        if (opt.isEmpty()) {
            throw new Exception("Ingrediant Category not found");
        }

        return opt.get();
    }

    @Override
    public List<IngrediantsCategory> findIngrediantsCategoriesByRestaurantId(Long id) throws Exception {

        restaurantService.findRestaurantById(id);
        return ingrediantCategoryRepository.findByRestaurantId(id);

    }

    @Override
    public IngrediantsItem createIngrediantsItem(Long restaurantId, String ingrediantName, Long categoryId)
            throws Exception {

        if (ingrediantName == null || ingrediantName.trim().isEmpty()) {
            throw new IllegalArgumentException("Ingredient name is required");
        }

        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
        IngrediantsCategory category = findIngrediantsCategoryById(categoryId);

        // ensure category belongs to restaurant
        if (!category.getRestaurant().getId().equals(restaurantId)) {
            throw new IllegalArgumentException("Category does not belong to this restaurant");
        }

        // duplicate check
        boolean exists = ingrediantItemRepository
                .existsByNameAndRestaurant(ingrediantName, restaurant);

        if (exists) {
            throw new IllegalArgumentException("Ingredient already exists");
        }

        IngrediantsItem item = new IngrediantsItem();
        item.setName(ingrediantName.trim());
        item.setRestaurant(restaurant);
        item.setCategory(category);

        return ingrediantItemRepository.save(item);
    }

    @Override
    public List<IngrediantsItem> findRestaurantIngrediants(Long restaurantId) {

        return ingrediantItemRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public IngrediantsItem updateStock(Long id) {

        IngrediantsItem item = ingrediantItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found with id: " + id));

        item.setStoke(!item.isStoke()); // toggle

        return ingrediantItemRepository.save(item);
    }

    @Override
    public void deleteIngrediantCategory(Long id) throws Exception {
        IngrediantsCategory category = ingrediantCategoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Ingrediant Category not found"));

        ingrediantCategoryRepository.delete(category);
    }
}
