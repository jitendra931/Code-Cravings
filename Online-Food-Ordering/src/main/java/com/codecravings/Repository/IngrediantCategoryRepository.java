package com.codecravings.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codecravings.model.IngrediantsCategory;
import com.codecravings.model.Restaurant;

public interface IngrediantCategoryRepository extends JpaRepository<IngrediantsCategory, Long> {

    boolean existsByNameAndRestaurant(String name, Restaurant restaurant);

    List<IngrediantsCategory> findByRestaurantId(Long id);
}
