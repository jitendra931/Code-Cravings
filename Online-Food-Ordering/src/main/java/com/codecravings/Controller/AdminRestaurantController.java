package com.codecravings.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codecravings.Services.RestaurantService;
import com.codecravings.Services.UserService;
import com.codecravings.model.Restaurant;
import com.codecravings.model.USER_ROLE;
import com.codecravings.model.User;
import com.codecravings.request.CreateRestaurantRequest;
import com.codecravings.response.MessageResponse;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/admin/restaurants")
public class AdminRestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @GetMapping("/demo")
    public String Demo() {
        return "Demo is working....";
    }

    @PostMapping()
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody CreateRestaurantRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantService.createRestaurant(req, user);

        return new ResponseEntity<>(restaurant, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @RequestBody CreateRestaurantRequest req,
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception {

        // Authenticate user
        User user = userService.findUserByJwtToken(jwt);

        // Call service with authorization
        Restaurant restaurant = restaurantService.updateRestaurant(id, req, user);

        return ResponseEntity.ok(restaurant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteRestaurant(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        // Fetch restaurant (validation)
        Restaurant restaurant = restaurantService.findRestaurantById(id);

        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found with id: " + id);
        }

        // Only ADMIN or OWNER can delete
        boolean isAdmin = user.getRole() == USER_ROLE.ROLE_ADMIN;
        boolean isOwner = restaurant.getOwner().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You are not authorized to delete this restaurant");
        }

        // Perform delete
        restaurantService.deleteRestaurant(id);

        // Return proper response
        MessageResponse res = new MessageResponse();
        res.setMessage("Restaurant deleted successfully!");

        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Restaurant> updateRestaurantStatus(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id,
            @RequestParam boolean open) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantService.updateRestaurantStatus(id, open, user);

        return ResponseEntity.ok(restaurant);
    }

    @GetMapping("/user")
    public ResponseEntity<Restaurant> findRestaurantByUserId(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());

        if (restaurant == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(restaurant);
    }

}
