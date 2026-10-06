package com.codecravings.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codecravings.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

}
