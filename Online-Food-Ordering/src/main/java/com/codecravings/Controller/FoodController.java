package com.codecravings.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codecravings.Services.FoodService;
import com.codecravings.Services.UserService;
import com.codecravings.model.Food;
import com.codecravings.model.User;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/food")
public class FoodController {

    @Autowired
    private UserService userService;

    @Autowired
    private FoodService foodService;

    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFood(@RequestParam String keyword) {

        List<Food> foods = foodService.searchFood(keyword);

        return ResponseEntity.ok(foods);
    }

    @GetMapping
public ResponseEntity<List<Food>> getAllAvailableFoods() {
    List<Food> foods = foodService.getAllAvailableFoods();
    return ResponseEntity.ok(foods);
}

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Food>> getRestaurantFood(@PathVariable Long restaurantId,
            @RequestParam boolean vegetarian, @RequestParam boolean seasonal, @RequestParam boolean nonveg,
            @RequestParam(required = false) String food_category, @RequestHeader("Authorization") String jwt)
            throws Exception {

        List<Food> foods = foodService.getRestaurantFood(restaurantId, vegetarian, nonveg, seasonal, food_category);

        return new ResponseEntity<>(foods, HttpStatus.OK);
    }


    

    @GetMapping("/{id}")
    public ResponseEntity<Food> getFoodById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Food food = foodService.findFoodById(id);

        if (!food.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to view this food");
        }

        return ResponseEntity.ok(food);
    }

}
