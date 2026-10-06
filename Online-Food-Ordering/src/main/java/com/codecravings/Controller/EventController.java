package com.codecravings.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codecravings.Repository.RestaurantRepository;
import com.codecravings.Services.EventService;
import com.codecravings.Services.UserService;
import com.codecravings.model.Event;
import com.codecravings.model.Restaurant;
import com.codecravings.model.User;

@RestController
@RequestMapping("/api/admin/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    // CREATE EVENT
    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody Event event,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found");
        }

        Event createdEvent = eventService.createEvent(
                event,
                restaurant.getId());

        return new ResponseEntity<>(
                createdEvent,
                HttpStatus.CREATED);
    }

    // GET ALL EVENTS OF LOGGED-IN RESTAURANT
    @GetMapping
    public ResponseEntity<List<Event>> getRestaurantEvents(
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found");
        }

        List<Event> events = eventService.getRestaurantEvents(
                restaurant.getId());

        return ResponseEntity.ok(events);
    }

    // GET SINGLE EVENT
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found");
        }

        Event event = eventService.findEventById(id);

        if (event.getRestaurant() == null ||
                !event.getRestaurant()
                        .getId()
                        .equals(restaurant.getId())) {

            throw new RuntimeException(
                    "You are not authorized to access this event");
        }

        return ResponseEntity.ok(event);
    }

    // UPDATE EVENT
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody Event event,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found");
        }

        Event updatedEvent = eventService.updateEvent(
                id,
                event,
                restaurant.getId());

        return ResponseEntity.ok(updatedEvent);
    }

    // DELETE EVENT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found");
        }

        eventService.deleteEvent(
                id,
                restaurant.getId());

        return ResponseEntity.noContent().build();
    }
}