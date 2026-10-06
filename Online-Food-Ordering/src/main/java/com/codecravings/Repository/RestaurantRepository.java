package com.codecravings.Repository;

import com.codecravings.model.Restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    @Query("SELECT r FROM Restaurant r WHERE lower(r.name) LIKE lower(concat('%',:query,'%')) OR lower(r.cuisinetype) LIKE lower(concat('%',:query, '%')) ")
    List<Restaurant> findBySearchQuery(String query);

    Restaurant findByOwnerId(Long UserId);
}
