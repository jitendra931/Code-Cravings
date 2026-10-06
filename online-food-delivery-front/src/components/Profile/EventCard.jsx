import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

const EventCard = ({ event, isAdmin = false, onDelete }) => {
  if (!event) return null;

  const eventId = event.Id ?? event.id;

  const startDate = dayjs(event.startedAt);
  const endDate = dayjs(event.endAt);
  const now = dayjs();

  let status = "UPCOMING";

  if (now.isAfter(endDate)) {
    status = "ENDED";
  } else if (now.isAfter(startDate) && now.isBefore(endDate)) {
    status = "LIVE";
  }

  const formatDate = (date) => {
    return date.format("DD MMM YYYY");
  };

  const formatTime = (date) => {
    return date.format("hh:mm A");
  };

  return (
    <Card
      className="event-card"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.25s ease",
        border: "1px solid #eeeeee",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* EVENT IMAGE */}
      <CardMedia
        component="img"
        height="220"
        image={event.image}
        alt={event.name}
        sx={{
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          p: 2.5,
        }}
      >
        {/* STATUS */}
        <Chip
          label={
            status === "LIVE"
              ? "Live Now"
              : status === "ENDED"
                ? "Ended"
                : "Upcoming"
          }
          size="small"
          color={
            status === "LIVE"
              ? "success"
              : status === "ENDED"
                ? "default"
                : "primary"
          }
          sx={{
            mb: 1.5,
            fontWeight: 600,
          }}
        />

        {/* EVENT NAME */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 1,
            lineHeight: 1.2,
          }}
        >
          {event.name}
        </Typography>

        {/* LOCATION */}
        <div className="flex items-center gap-1 mb-3">
          <LocationOnIcon
            sx={{
              fontSize: 19,
              color: "text.secondary",
            }}
          />

          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </div>

        {/* START */}
        <div className="flex items-center gap-2 mb-2">
          <EventIcon
            sx={{
              fontSize: 19,
              color: "primary.main",
            }}
          />

          <div>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Starts
            </Typography>

            <Typography variant="body2" fontWeight={600}>
              {formatDate(startDate)} · {formatTime(startDate)}
            </Typography>
          </div>
        </div>

        {/* END */}
        <div className="flex items-center gap-2">
          <AccessTimeIcon
            sx={{
              fontSize: 19,
              color: "error.main",
            }}
          />

          <div>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Ends
            </Typography>

            <Typography variant="body2" fontWeight={600}>
              {formatDate(endDate)} · {formatTime(endDate)}
            </Typography>
          </div>
        </div>
      </CardContent>

      {/* ADMIN DELETE */}
      {isAdmin && (
        <CardActions
          sx={{
            justifyContent: "flex-end",
            px: 2,
            pb: 2,
          }}
        >
          <IconButton color="error" onClick={() => onDelete?.(eventId)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};

export default EventCard;
