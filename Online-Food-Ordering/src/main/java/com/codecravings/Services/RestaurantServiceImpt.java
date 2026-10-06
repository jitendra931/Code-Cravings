package com.codecravings.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codecravings.Repository.AddressRepository;
import com.codecravings.Repository.RestaurantRepository;
import com.codecravings.Repository.UserRepository;
import com.codecravings.dto.RestaurantDto;
import com.codecravings.model.Address;
import com.codecravings.model.Restaurant;
import com.codecravings.model.USER_ROLE;
import com.codecravings.model.User;
import com.codecravings.request.CreateRestaurantRequest;

@Service
public class RestaurantServiceImpt implements RestaurantService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {
        Address address = addressRepository.save(req.getAddress());

        Restaurant restaurant = new Restaurant();
        restaurant.setAddress(address);
        restaurant.setContactInformation(req.getContactInformation());
        restaurant.setCuisinetype(req.getCousineType());
        restaurant.setDescription(req.getDescription());
        restaurant.setImages(req.getImages());
        restaurant.setName(req.getName());
        restaurant.setOpeningHours(req.getOpeningHours());
        restaurant.setRegistrationDate(LocalDateTime.now());
        restaurant.setOwner(user);

        return restaurantRepository.save(restaurant);
    }

    @Override
    public Restaurant updateRestaurant(Long restaurantId,
            CreateRestaurantRequest updatedRestaurant,
            User user) throws Exception {

        // 1. Fetch restaurant
        Restaurant restaurant = findRestaurantById(restaurantId);

        // 2. Authorization check
        boolean isAdmin = user.getRole() == USER_ROLE.ROLE_ADMIN;
        boolean isOwner = restaurant.getOwner().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You are not authorized to update this restaurant");
        }

        // 3. Update fields (FIXED LOGIC)
        if (updatedRestaurant.getCousineType() != null) {
            restaurant.setCuisinetype(updatedRestaurant.getCousineType());
        }
        if (updatedRestaurant.getDescription() != null) {
            restaurant.setDescription(updatedRestaurant.getDescription());
        }
        if (updatedRestaurant.getName() != null) {
            restaurant.setName(updatedRestaurant.getName());
        }
        if (updatedRestaurant.getOpeningHours() != null) {
            restaurant.setOpeningHours(updatedRestaurant.getOpeningHours());
        }
        if (updatedRestaurant.getContactInformation() != null) {
            restaurant.setContactInformation(updatedRestaurant.getContactInformation());
        }

        return restaurantRepository.save(restaurant);
    }

    @Override
    public Restaurant deleteRestaurant(Long restaurantId) throws Exception {
        Restaurant restaurant = findRestaurantById(restaurantId);

        restaurantRepository.delete(restaurant);
        return restaurant;
    }

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @Override
    public List<Restaurant> searchRestaurants(String keyword) {
        return restaurantRepository.findBySearchQuery(keyword);
    }

    @Override
    public Restaurant findRestaurantById(Long id) throws Exception {
        Optional<Restaurant> opt = restaurantRepository.findById(id);

        if (opt.isEmpty()) {
            throw new Exception("restaurant not found with id!");
        }
        return opt.get();
    }

    @Override
    public Restaurant getRestaurantByUserId(Long userId) {
        return restaurantRepository.findByOwnerId(userId);
    }

    @Override
    public RestaurantDto addToFavorites(Long restaurantId, User user) throws Exception {

        Restaurant restaurant = findRestaurantById(restaurantId);

        List<Restaurant> favourites = user.getFavourite();

        // Check by ID (correct way)
        boolean exists = favourites.stream()
                .anyMatch(r -> r.getId().equals(restaurantId));

        if (exists) {
            favourites.removeIf(r -> r.getId().equals(restaurantId));
        } else {
            favourites.add(restaurant);
        }

        userRepository.save(user);

        // Convert to DTO
        RestaurantDto dto = new RestaurantDto();
        dto.setId(restaurant.getId());
        dto.setTitle(restaurant.getName());
        dto.setDescription(restaurant.getDescription());
        dto.setImages(restaurant.getImages());

        return dto;
    }

    @Override
    public Restaurant updateRestaurantStatus(Long id, boolean open, User user) {

        // 1. Fetch restaurant
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // 2. Authorization check
        boolean isAdmin = user.getRole() == USER_ROLE.ROLE_ADMIN;
        boolean isOwner = restaurant.getOwner().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You are not authorized to update restaurant status");
        }

        // 3. Set explicit status
        restaurant.setOpen(open);

        return restaurantRepository.save(restaurant);
    }

}
