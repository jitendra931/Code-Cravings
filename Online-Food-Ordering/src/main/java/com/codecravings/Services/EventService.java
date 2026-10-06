package com.codecravings.Services;

import java.util.List;

import com.codecravings.model.Event;

public interface EventService {

    Event createEvent(Event event, Long restaurantId) throws Exception;

    List<Event> getRestaurantEvents(Long restaurantId);

    Event findEventById(Long eventId) throws Exception;

    Event updateEvent(Long eventId, Event event, Long restaurantId) throws Exception;

    void deleteEvent(Long eventId, Long restaurantId) throws Exception;
}