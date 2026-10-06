package com.codecravings.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codecravings.model.OrderItem;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    boolean existsByFoodId(Long foodId);
}