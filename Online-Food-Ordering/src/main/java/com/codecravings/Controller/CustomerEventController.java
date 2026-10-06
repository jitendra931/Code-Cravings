package com.codecravings.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codecravings.Repository.EventRepository;
import com.codecravings.model.Event;

@RestController
@RequestMapping("/api/events")
public class CustomerEventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {

        List<Event> events = eventRepository.findAllByOrderByStartedAtAsc();

        return ResponseEntity.ok(events);
    }
}