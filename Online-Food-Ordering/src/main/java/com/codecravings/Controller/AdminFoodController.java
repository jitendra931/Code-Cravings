package com.codecravings.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codecravings.Services.CategoryService;
import com.codecravings.Services.FoodService;
import com.codecravings.Services.RestaurantService;
import com.codecravings.Services.UserService;
import com.codecravings.model.Food;
import com.codecravings.model.Restaurant;
import com.codecravings.model.User;
import com.codecravings.request.CreateFoodReq;
import com.codecravings.response.MessageResponse;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import com.codecravings.model.Category;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/admin/food")
public class AdminFoodController {
    @Autowired
    private UserService userService;

    @Autowired
    private FoodService foodService;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CategoryService categoryService;

    @PostMapping()
    public ResponseEntity<Food> createFood(
            @RequestBody CreateFoodReq req,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantService.findRestaurantById(req.getRestaurantId());

        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to add food");
        }

        Category category = categoryService.findCategoryByName(
                req.getCategory().getName(),
                restaurant.getId());

        Food food = foodService.createFood(req, restaurant, category);

        return ResponseEntity.status(HttpStatus.CREATED).body(food);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Food food = foodService.findFoodById(id);

        if (!food.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to delete this food");
        }

        try {

            foodService.deleteFood(id);

            MessageResponse res = new MessageResponse();
            res.setMessage("Food deleted successfully");

            return ResponseEntity.ok(res);

        } catch (IllegalStateException e) {

            MessageResponse res = new MessageResponse();
            res.setMessage(e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(res);
        }
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Food> updateFoodAvailabilityStatus(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Food food = foodService.findFoodById(id);

        // Authorization check
        if (!food.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this food");
        }

        Food updatedFood = foodService.updateAvailibilityStatus(id);

        return ResponseEntity.ok(updatedFood);
    }


@PutMapping("/{foodId}")
public ResponseEntity<Food> updateFood(
        @PathVariable Long foodId,
        @RequestBody CreateFoodReq req,
        @RequestHeader("Authorization") String jwt) throws Exception {

    User user = userService.findUserByJwtToken(jwt);

    Food existingFood = foodService.findFoodById(foodId);

    if (!existingFood.getRestaurant().getOwner().getId().equals(user.getId())) {
        throw new RuntimeException("You are not authorized to update this food");
    }

    Food updatedFood = foodService.updateFood(foodId, req);

    return ResponseEntity.ok(updatedFood);
}

}
