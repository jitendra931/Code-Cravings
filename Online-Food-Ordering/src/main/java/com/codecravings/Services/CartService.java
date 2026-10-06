package com.codecravings.Services;

import com.codecravings.model.Cart;
import com.codecravings.model.CartItem;
import com.codecravings.request.AddCartItemRequest;

public interface CartService {

    CartItem addItemToCart(AddCartItemRequest req, Long userId) throws Exception;

    CartItem updateCartItemQuantity(Long cartItemId, int quantity) throws Exception;

    Cart removeItemFromCart(Long cartItemId, Long userId);

    Long calculateCartTotals(Cart cart) throws Exception;

    Cart findCartById(Long id) throws Exception;

    Cart findCartByUserId(Long userId) throws Exception;

    Cart clearCart(Long userId) throws Exception;
}
