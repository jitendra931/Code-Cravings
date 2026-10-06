import React from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "./EventCard";
import "./Others.css";
import { CircularProgress, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import { getAllEvents } from "../State/Restaurant/Action";

const Events = () => {
  const dispatch = useDispatch();

  const {
    events = [],
    loading,
    error,
  } = useSelector((state) => state.restaurant);

  const jwt = localStorage.getItem("jwt");

  React.useEffect(() => {
    if (jwt) {
      dispatch(getAllEvents({ jwt }));
    }
  }, [dispatch, jwt]);

  return (
    <div className="events-page">
      {/* HEADER */}
      <div className="events-header">
        <div>
          <Typography variant="h4" className="events-title">
            Upcoming Events
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            className="events-subtitle"
          >
            Discover exciting events, offers and special experiences from our
            restaurants.
          </Typography>
        </div>

        <EventAvailableIcon className="events-header-icon" />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="events-state">
          <CircularProgress />
          <Typography color="text.secondary">Loading events...</Typography>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="events-state">
          <Typography color="error">Failed to load events.</Typography>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && events.length === 0 && (
        <div className="events-state">
          <EventAvailableIcon
            sx={{
              fontSize: 55,
              color: "text.secondary",
            }}
          />

          <Typography variant="h6" fontWeight={600}>
            No upcoming events
          </Typography>

          <Typography color="text.secondary">
            Check back later for new events and offers.
          </Typography>
        </div>
      )}

      {/* EVENTS */}
      {!loading && !error && events.length > 0 && (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event.Id ?? event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
