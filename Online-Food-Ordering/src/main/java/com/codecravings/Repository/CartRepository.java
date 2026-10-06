package com.codecravings.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codecravings.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

    public Cart findByCustomerId(Long userId);
}
