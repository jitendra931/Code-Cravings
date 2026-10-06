package com.codecravings.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codecravings.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByRestaurantIdOrderByStartedAtAsc(Long restaurantId);

    Optional<Event> findByIdAndRestaurantId(Long eventId, Long restaurantId);

    List<Event> findAllByOrderByStartedAtAsc();

}