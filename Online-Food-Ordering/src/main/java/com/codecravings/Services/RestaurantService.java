package com.codecravings.Services;

import java.util.List;

import com.codecravings.dto.RestaurantDto;
import com.codecravings.model.Restaurant;
import com.codecravings.model.User;
import com.codecravings.request.CreateRestaurantRequest;

public interface RestaurantService {

    public Restaurant createRestaurant(CreateRestaurantRequest req, User user);

    public Restaurant updateRestaurant(Long restaurantId,
            CreateRestaurantRequest updatedRestaurant,
            User user) throws Exception;

    public Restaurant deleteRestaurant(Long restaurantId) throws Exception;

    public List<Restaurant> getAllRestaurants();

    public List<Restaurant> searchRestaurants(String keyword);

    public Restaurant findRestaurantById(Long id) throws Exception;

    public Restaurant getRestaurantByUserId(Long userId) throws Exception;

    public RestaurantDto addToFavorites(Long restaurantId, User user) throws Exception;

    public Restaurant updateRestaurantStatus(Long id, boolean open, User user) throws Exception;

}
