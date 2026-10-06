package com.codecravings.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codecravings.Services.IngrediantService;
import com.codecravings.Services.UserService;
import com.codecravings.model.IngrediantsCategory;
import com.codecravings.model.IngrediantsItem;
import com.codecravings.model.Restaurant;
import com.codecravings.model.User;
import com.codecravings.request.IngrediantCategoryRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/admin/ingrediants")
public class IngrediantController {

    @Autowired
    private IngrediantService ingrediantService;

    @Autowired
    private UserService userService;

    @PostMapping("/category")
    public ResponseEntity<IngrediantsCategory> createIngrediantCategory(@RequestBody IngrediantCategoryRequest req)
            throws Exception {
        IngrediantsCategory item = ingrediantService.createIngrediantCategory(req.getName(), req.getRestaurantId());
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @PostMapping
    public ResponseEntity<IngrediantsItem> createIngrediantItem(
            @RequestBody IngrediantCategoryRequest req) throws Exception {

        IngrediantsItem item = ingrediantService.createIngrediantsItem(
                req.getRestaurantId(),
                req.getName(),
                req.getCategoryId());

        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/stoke")
    public ResponseEntity<IngrediantsItem> updateIngrediantStoke(@PathVariable Long id) throws Exception {
        IngrediantsItem item = ingrediantService.updateStock(id);

        return new ResponseEntity<>(item, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{id}")
    public ResponseEntity<List<IngrediantsItem>> getRestaurantIngrediant(@PathVariable Long id) throws Exception {
        List<IngrediantsItem> items = ingrediantService.findRestaurantIngrediants(id);

        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{id}/category")
    public ResponseEntity<List<IngrediantsCategory>> getRestaurantIngrediantCategory(@PathVariable Long id)
            throws Exception {
        List<IngrediantsCategory> items = ingrediantService.findIngrediantsCategoriesByRestaurantId(id);

        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<Void> deleteIngrediantCategory(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        IngrediantsCategory category = ingrediantService.findIngrediantsCategoryById(id);

        Restaurant restaurant = category.getRestaurant();

        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to delete this category");
        }

        ingrediantService.deleteIngrediantCategory(id);

        return ResponseEntity.noContent().build();
    }

}
