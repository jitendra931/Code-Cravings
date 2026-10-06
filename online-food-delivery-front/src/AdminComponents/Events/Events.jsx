import React from "react";
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { useDispatch } from "react-redux";
import { createEventAction } from "../../components/State/Restaurant/Action";

const initialValues = {
  image: "",
  location: "",
  name: "",
  startedAt: null,
  endAt: null,
};

const Events = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const [formValues, setFormValues] = React.useState(initialValues);

  const [errors, setErrors] = React.useState({});

  const handleOpen = () => {
    setFormValues(initialValues);
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleDateChange = (date, dateType) => {
    setFormValues((prev) => ({
      ...prev,
      [dateType]: date,
    }));

    setErrors((prev) => ({
      ...prev,
      [dateType]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = "Event name is required";
    }

    if (!formValues.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formValues.image.trim()) {
      newErrors.image = "Image URL is required";
    }

    if (!formValues.startedAt) {
      newErrors.startedAt = "Start date and time is required";
    }

    if (!formValues.endAt) {
      newErrors.endAt = "End date and time is required";
    }

    if (
      formValues.startedAt &&
      formValues.endAt &&
      dayjs(formValues.endAt).isBefore(dayjs(formValues.startedAt))
    ) {
      newErrors.endAt = "End time must be after start time";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      // console.error("JWT not found");
      return;
    }

    const data = {
      image: formValues.image.trim(),
      location: formValues.location.trim(),
      name: formValues.name.trim(),
      startedAt: dayjs(formValues.startedAt).format("YYYY-MM-DD HH:mm:ss"),
      endAt: dayjs(formValues.endAt).format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      await dispatch(
        createEventAction({
          data,
          jwt,
        }),
      );

      handleClose();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-5">
        {/* CREATE EVENT BUTTON */}

        <Button
          onClick={handleOpen}
          variant="contained"
          startIcon={<EventIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            px: 3,
            py: 1.2,
            fontWeight: 600,
          }}
        >
          Create New Event
        </Button>

        {/* MODAL */}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="create-event-title"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",

              width: {
                xs: "90%",
                sm: 500,
              },

              maxHeight: "90vh",
              overflowY: "auto",

              bgcolor: "background.paper",
              borderRadius: "16px",
              boxShadow: 24,
              outline: "none",
            }}
          >
            {/* HEADER */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 2,
              }}
            >
              <Box>
                <Typography
                  id="create-event-title"
                  variant="h5"
                  fontWeight={700}
                >
                  Create Event
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Add the details of your upcoming event.
                </Typography>
              </Box>

              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider />

            {/* FORM */}

            <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
              <Grid container spacing={2.5}>
                {/* EVENT NAME */}

                <Grid size={12}>
                  <TextField
                    name="name"
                    label="Event Name"
                    placeholder="Enter event name"
                    fullWidth
                    value={formValues.name}
                    onChange={handleFormChange}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <EventIcon
                            sx={{
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* LOCATION */}

                <Grid size={12}>
                  <TextField
                    name="location"
                    label="Location"
                    placeholder="Enter event location"
                    fullWidth
                    value={formValues.location}
                    onChange={handleFormChange}
                    error={Boolean(errors.location)}
                    helperText={errors.location}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <LocationOnIcon
                            sx={{
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* IMAGE */}

                <Grid size={12}>
                  <TextField
                    name="image"
                    label="Image URL"
                    placeholder="https://example.com/image.jpg"
                    fullWidth
                    value={formValues.image}
                    onChange={handleFormChange}
                    error={Boolean(errors.image)}
                    helperText={
                      errors.image || "Provide an image URL for the event"
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <ImageIcon
                            sx={{
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* START DATE */}

                <Grid size={12}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={formValues.startedAt}
                    onChange={(newValue) =>
                      handleDateChange(newValue, "startedAt")
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.startedAt),
                        helperText: errors.startedAt,
                      },
                    }}
                  />
                </Grid>

                {/* END DATE */}

                <Grid size={12}>
                  <DateTimePicker
                    label="End Date & Time"
                    value={formValues.endAt}
                    onChange={(newValue) => handleDateChange(newValue, "endAt")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.endAt),
                        helperText: errors.endAt,
                      },
                    }}
                  />
                </Grid>

                <Grid size={12}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 1,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleClose}
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                        py: 1.2,
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      startIcon={<EventIcon />}
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                        py: 1.2,
                        fontWeight: 600,
                      }}
                    >
                      Create Event
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      </div>
    </LocalizationProvider>
  );
};

export default Events;
