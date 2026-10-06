package com.codecravings.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codecravings.Services.OrderService;
import com.codecravings.Services.UserService;
import com.codecravings.model.Orders;
import com.codecravings.model.User;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/order/restaurant/{id}")
    public ResponseEntity<List<Orders>> getOrderHistory(@PathVariable Long id,
            @RequestParam(required = false) String order_status,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        List<Orders> order = orderService.getRestaurantOrders(id, order_status);

        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @PutMapping("/order/{id}/{orderStatus}")
    public ResponseEntity<Orders> updateOrderStatus(
            @PathVariable Long id,
            @PathVariable String orderStatus,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Orders order = orderService.findOrderById(id);

        // authorization check
        if (!order.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized");
        }

        Orders updatedOrder = orderService.updateOrder(id, orderStatus);

        return ResponseEntity.ok(updatedOrder);
    }

}
