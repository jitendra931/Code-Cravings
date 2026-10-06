package com.codecravings.Services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codecravings.Repository.CartItemRepository;
import com.codecravings.Repository.CartRepository;
import com.codecravings.model.Cart;
import com.codecravings.model.CartItem;
import com.codecravings.model.Food;
import com.codecravings.model.User;
import com.codecravings.request.AddCartItemRequest;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private FoodService foodService;

    @Override
    public CartItem addItemToCart(AddCartItemRequest req, Long userId) throws Exception {

        User user = userService.findUserById(userId);

        if (req.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        Food food = foodService.findFoodById(req.getFoodId());

        Cart cart = cartRepository.findByCustomerId(user.getId());

        if (cart == null) {
            cart = new Cart();
            cart.setCustomer(user);
            cart.setItems(new ArrayList<>());
            cart = cartRepository.save(cart);
        }

        for (CartItem cartItem : cart.getItems()) {
            if (cartItem.getFood().getId().equals(food.getId())) {
                int newQuantity = cartItem.getQuantity() + req.getQuantity();
                return updateCartItemQuantity(cartItem.getId(), newQuantity);
            }
        }

        CartItem newItem = new CartItem();
        newItem.setFood(food);
        newItem.setCart(cart);
        newItem.setQuantity(req.getQuantity());
        newItem.setIngrediants(req.getIngrediants());
        newItem.setTotalPrice(req.getQuantity() * food.getPrice());

        CartItem savedItem = cartItemRepository.save(newItem);

        cart.getItems().add(savedItem);
        cartRepository.save(cart);

        return savedItem;
    }

    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) throws Exception {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null; // or throw exception depending on design
        }

        item.setQuantity(quantity);
        item.setTotalPrice(quantity * item.getFood().getPrice());

        return cartItemRepository.save(item);
    }

    @Override
    public Cart removeItemFromCart(Long cartItemId, Long userId) {

        Cart cart = cartRepository.findByCustomerId(userId);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return cartRepository.save(cart);
    }

    @Override
    public Long calculateCartTotals(Cart cart) throws Exception {

        Long total = 0L;

        for (CartItem cartItem : cart.getItems()) {
            total += cartItem.getFood().getPrice() * cartItem.getQuantity();
        }
        return total;

    }

    @Override
    public Cart findCartById(Long id) throws Exception {
        Optional<Cart> optionalCart = cartRepository.findById(id);

        if (optionalCart.isEmpty()) {
            throw new Exception("cart not found with id " + id);
        }

        return optionalCart.get();
    }

    @Override
    public Cart findCartByUserId(Long userId) throws Exception {

        Cart cart = cartRepository.findByCustomerId(userId);

        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }

        cart.setTotal(calculateCartTotals(cart));

        return cart;
    }

    @Override
    public Cart clearCart(Long userId) throws Exception {

        Cart cart = findCartByUserId(userId);

        cart.getItems().clear();
        cart.setTotal(0L);

        return cartRepository.save(cart);
    }

}
