package com.codecravings.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codecravings.Repository.EventRepository;
import com.codecravings.Repository.RestaurantRepository;
import com.codecravings.model.Event;
import com.codecravings.model.Restaurant;

@Service
public class EventServiceImpt implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public Event createEvent(Event event, Long restaurantId) throws Exception {

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        event.setId(null);
        event.setRestaurant(restaurant);

        return eventRepository.save(event);
    }

    @Override
    public List<Event> getRestaurantEvents(Long restaurantId) {

        return eventRepository.findByRestaurantIdOrderByStartedAtAsc(
                restaurantId);
    }

    @Override
    public Event findEventById(Long eventId) throws Exception {

        return eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Override
    public Event updateEvent(
            Long eventId,
            Event event,
            Long restaurantId) throws Exception {

        Event existingEvent = eventRepository.findByIdAndRestaurantId(
                eventId,
                restaurantId)
                .orElseThrow(() -> new RuntimeException(
                        "Event not found or you are not authorized"));

        existingEvent.setName(event.getName());
        existingEvent.setLocation(event.getLocation());
        existingEvent.setImage(event.getImage());
        existingEvent.setStartedAt(event.getStartedAt());
        existingEvent.setEndAt(event.getEndAt());

        return eventRepository.save(existingEvent);
    }

    @Override
    public void deleteEvent(
            Long eventId,
            Long restaurantId) throws Exception {

        Event event = eventRepository.findByIdAndRestaurantId(
                eventId,
                restaurantId)
                .orElseThrow(() -> new RuntimeException(
                        "Event not found or you are not authorized"));

        eventRepository.delete(event);
    }
}