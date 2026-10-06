package com.codecravings.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codecravings.model.Orders;

public interface OrderRepository extends JpaRepository<Orders, Long> {

    // =========================
    // CUSTOMER ORDERS
    // =========================

    @Query(value = """
            SELECT *
            FROM orders
            WHERE customer_id = :userId
            ORDER BY id DESC
            """, nativeQuery = true)
    List<Orders> findOrdersByCustomerId(
            @Param("userId") Long userId);

    // =========================
    // RESTAURANT ORDERS
    // =========================

    @Query("""
                SELECT DISTINCT o
                FROM Orders o
                LEFT JOIN FETCH o.items i
                LEFT JOIN FETCH i.food
                LEFT JOIN FETCH o.customer
                LEFT JOIN FETCH o.deliveryAddress
                WHERE o.restaurant.id = :restaurantId
                ORDER BY o.Id DESC
            """)
    List<Orders> findRestaurantOrders(
            @Param("restaurantId") Long restaurantId);

    // =========================
    // RESTAURANT ORDERS - ENTITY GRAPH
    // =========================

    @EntityGraph(attributePaths = {
            "items",
            "items.food",
            "customer",
            "deliveryAddress"
    })
    List<Orders> findByRestaurantId(Long restaurantId);
}