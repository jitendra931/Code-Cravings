package com.codecravings.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codecravings.Repository.OrderRepository;
import com.codecravings.Services.CartService;
import com.codecravings.Services.OrderService;
import com.codecravings.Services.PaymentService;
import com.codecravings.Services.UserService;
import com.codecravings.model.Orders;
import com.codecravings.model.User;
import com.codecravings.request.OrderRequest;
import com.codecravings.response.MessageResponse;
import com.codecravings.response.PaymentResponse;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/order")
    public ResponseEntity<PaymentResponse> createOrder(
            @RequestBody OrderRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Orders orders = orderService.createOrder(req, user);

        PaymentResponse res = paymentService.createPaymentLink(orders);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("/payment/{orderId}")
    public ResponseEntity<?> updatePayment(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        try {

            User user = userService.findUserByJwtToken(jwt);

            Orders order = orderService.findOrderById(orderId);

            if (!"COMPLETED".equals(order.getPaymentStatus())) {

                order.setPaymentStatus("COMPLETED");

                orderRepository.save(order);

                cartService.clearCart(user.getId());
            }

            return ResponseEntity.ok(order);

        } catch (Exception e) {
            e.printStackTrace(); // <-- IMPORTANT
            throw e;
        }
    }

    @GetMapping("/order/user")
    public ResponseEntity<List<Orders>> getOrderHistory(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        System.out.println("====================================");
        System.out.println("USER FROM JWT");
        System.out.println("ID: " + user.getId());
        System.out.println("EMAIL: " + user.getEmail());

        List<Orders> orders = orderService.getUsersOrder(user.getId());

        System.out.println(
                "ORDERS RETURNED TO CONTROLLER: "
                        + orders.size());

        System.out.println("====================================");

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<Orders> findOrderById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        userService.findUserByJwtToken(jwt);

        Orders order = orderService.findOrderById(id);

        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/order/{id}")
    public ResponseEntity<MessageResponse> cancelOrder(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Orders order = orderService.findOrderById(id);

        if (!order.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to cancel this order");
        }

        orderService.cancelOrder(id);

        MessageResponse response = new MessageResponse();
        response.setMessage("Order cancelled successfully");

        return ResponseEntity.ok(response);
    }
}
