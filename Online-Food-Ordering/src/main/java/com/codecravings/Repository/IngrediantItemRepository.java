package com.codecravings.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codecravings.model.IngrediantsItem;
import com.codecravings.model.Restaurant;

public interface IngrediantItemRepository extends JpaRepository<IngrediantsItem, Long> {

    List<IngrediantsItem> findByRestaurantId(Long id);

    boolean existsByNameAndRestaurant(String name, Restaurant restaurant);

}
