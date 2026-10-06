package com.codecravings.Services;

import java.util.List;

import com.codecravings.model.Orders;
import com.codecravings.model.User;
import com.codecravings.request.OrderRequest;;

public interface OrderService {
    public Orders createOrder(OrderRequest order, User User) throws Exception;

    public Orders updateOrder(Long orderId, String orderStatus) throws Exception;

    public Orders save(Orders orders) throws Exception;

    public void cancelOrder(Long orderId) throws Exception;

    public List<Orders> getUsersOrder(Long userId) throws Exception;

    public List<Orders> getRestaurantOrders(Long restaurantId, String orderStatus) throws Exception;

    public Orders findOrderById(Long orderId) throws Exception;
}
