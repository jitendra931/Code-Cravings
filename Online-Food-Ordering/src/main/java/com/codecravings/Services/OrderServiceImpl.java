package com.codecravings.Services;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codecravings.Repository.AddressRepository;
import com.codecravings.Repository.OrderItemRepository;
import com.codecravings.Repository.OrderRepository;
import com.codecravings.Repository.UserRepository;
import com.codecravings.model.Address;
import com.codecravings.model.Cart;
import com.codecravings.model.CartItem;
import com.codecravings.model.OrderItem;
import com.codecravings.model.Orders;
import com.codecravings.model.Restaurant;
import com.codecravings.model.User;
import com.codecravings.request.OrderRequest;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CartService cartService;

    @Override
    public Orders createOrder(OrderRequest order, User user) throws Exception {

        Address shippAddress = order.getDeliveryAddress();

        Optional<Address> existing = addressRepository
                .findByStreetAndCityAndStateAndZip(
                        shippAddress.getStreet(),
                        shippAddress.getCity(),
                        shippAddress.getState(),
                        shippAddress.getZip());

        Address savedAddress;

        if (existing.isPresent()) {
            savedAddress = existing.get();
        } else {
            savedAddress = addressRepository.save(shippAddress);
        }

        boolean alreadyExists = user.getAddresses()
                .stream()
                .anyMatch(a -> a.getId().equals(savedAddress.getId()));

        if (!alreadyExists) {
            user.getAddresses().add(savedAddress);
            userRepository.save(user);
        }

        Restaurant restaurant = restaurantService.findRestaurantById(order.getRestaurantId());

        Orders createOrder = new Orders();

        createOrder.setCustomer(user);
        createOrder.setCreatedAt(new Date(System.currentTimeMillis()));
        createOrder.setOrderStatus("PENDING");
        createOrder.setPaymentStatus("PENDING");
        createOrder.setDeliveryAddress(savedAddress);
        createOrder.setRestaurant(restaurant);

        Cart cart = cartService.findCartByUserId(user.getId());

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {

            OrderItem orderItem = new OrderItem();

            orderItem.setFood(cartItem.getFood());
            orderItem.setIngredients(cartItem.getIngrediants());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());

            orderItem.setOrder(createOrder);

            orderItems.add(orderItem);
        }

        Long totalPrice = cartService.calculateCartTotals(cart);

        createOrder.setItems(orderItems);
        createOrder.setTotalPrice(totalPrice);
        createOrder.setTotalItem(orderItems.size());

        Orders savedOrder = orderRepository.save(createOrder);

        return savedOrder;
    }

    @Override
    public Orders updateOrder(Long orderId, String orderStatus) throws Exception {

        Orders order = findOrderById(orderId);
        if (orderStatus.equals("OUT_FOR_DELIVERY") || orderStatus.equals("DELIVERED") || orderStatus.equals("COMPLETED")
                || orderStatus.equals("PENDING")) {
            order.setOrderStatus(orderStatus);
            return orderRepository.save(order);
        }

        throw new Exception("Please select valid order status");
    }

    @Override
    public void cancelOrder(Long orderId) throws Exception {
        Orders order = findOrderById(orderId);
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<Orders> getUsersOrder(Long userId) throws Exception {

        System.out.println("====================================");
        System.out.println("Fetching orders for user ID: " + userId);

        List<Orders> orders = orderRepository.findOrdersByCustomerId(userId);

        System.out.println("Orders found: " + orders.size());

        for (Orders order : orders) {
            System.out.println(
                    "Order ID: " + order.getId()
                            + " | Customer ID: "
                            + order.getCustomer().getId()
                            + " | Items: "
                            + (order.getItems() == null ? 0 : order.getItems().size()));
        }

        System.out.println("====================================");

        return orders;
    }

    @Override
    public List<Orders> getRestaurantOrders(
            Long restaurantId,
            String orderStatus) throws Exception {

        List<Orders> orders = orderRepository.findByRestaurantId(restaurantId);

        if (orderStatus != null && !orderStatus.isBlank()) {
            orders = orders.stream()
                    .filter(order -> order.getOrderStatus().equalsIgnoreCase(orderStatus))
                    .collect(Collectors.toList());
        }

        return orders;
    }

    @Override
    public Orders findOrderById(Long orderId) throws Exception {
        Optional<Orders> optionalOrder = orderRepository.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new Exception("order not found");
        }

        return optionalOrder.get();
    }

    @Override
    public Orders save(Orders orders) throws Exception {
        return orderRepository.save(orders);
    }

}
