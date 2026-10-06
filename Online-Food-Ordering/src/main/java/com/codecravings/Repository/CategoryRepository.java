package com.codecravings.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codecravings.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    public List<Category> findByRestaurantId(Long id);

    Category findByNameAndRestaurantId(
            String name,
            Long restaurantId);
}
