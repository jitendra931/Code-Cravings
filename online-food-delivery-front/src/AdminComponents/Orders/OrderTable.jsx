import "./OrderTable.css";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Paper,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchRestaurantsOrder,
  updateOrderStatus,
} from "../../components/State/Restaurant Order/Action";

const OrderTable = () => {
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const restaurant = useSelector((store) => store.restaurant);
  const restaurantOrder = useSelector((store) => store.restaurantOrder);

  const restaurantId = restaurant?.usersRestaurant?.id;

  const orders = Array.isArray(restaurantOrder?.orders)
    ? restaurantOrder.orders
    : [];

  // =========================
  // FILTER
  // =========================

  const [statusFilter, setStatusFilter] = useState("ALL");

  // =========================
  // STATUS MENU
  // =========================

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // =========================
  // FETCH ORDERS
  // =========================

  useEffect(() => {
    if (!jwt || !restaurantId) return;

    dispatch(
      fetchRestaurantsOrder({
        jwt,
        restaurantId,
        orderStatus: statusFilter === "ALL" ? undefined : statusFilter,
      }),
    );
  }, [dispatch, jwt, restaurantId, statusFilter]);

  // =========================
  // OPEN STATUS MENU
  // =========================

  const handleOpenStatusMenu = (event, order) => {
    setMenuAnchor(event.currentTarget);
    setSelectedOrder(order);
  };

  // =========================
  // CLOSE STATUS MENU
  // =========================

  const handleCloseStatusMenu = () => {
    setMenuAnchor(null);
    setSelectedOrder(null);
  };

  // =========================
  // CHANGE STATUS
  // =========================

  const handleStatusChange = (newStatus) => {
    if (!selectedOrder) return;

    const orderId = selectedOrder?.Id ?? selectedOrder?.id;

    dispatch(
      updateOrderStatus({
        orderId,
        orderStatus: newStatus,
        jwt,
        restaurantId,
        currentFilter: statusFilter,
      }),
    );

    handleCloseStatusMenu();
  };

  // =========================
  // STATUS COLOR
  // =========================

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";

      case "OUT_FOR_DELIVERY":
        return "info";

      case "DELIVERED":
        return "success";

      case "COMPLETED":
        return "success";

      default:
        return "default";
    }
  };

  // =========================
  // FLATTEN ORDERS
  // =========================

  const orderRows = orders.flatMap((order) =>
    (order.items || []).map((item) => ({
      order,
      item,
    })),
  );

  return (
    <Box className="restau-order-table-wrapper">
      <Card className="restau-order-card">
        {/* =========================
            HEADER
        ========================= */}

        <div className="restau-order-header">
          <h2>All Orders</h2>

          <FormControl size="small" className="order-status-filter">
            <InputLabel>Status</InputLabel>

            <Select
              value={statusFilter}
              label="Status"
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <MenuItem value="ALL">All Orders</MenuItem>

              <MenuItem value="PENDING">Pending</MenuItem>

              <MenuItem value="OUT_FOR_DELIVERY">Out for Delivery</MenuItem>

              <MenuItem value="DELIVERED">Delivered</MenuItem>

              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* =========================
            TABLE
        ========================= */}

        <TableContainer
          component={Paper}
          className="restau-order-table-container"
        >
          <Table stickyHeader className="restau-order-table">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>

                <TableCell>Customer</TableCell>

                <TableCell>Image</TableCell>

                <TableCell>Food</TableCell>

                <TableCell align="center">Price</TableCell>

                <TableCell>Ingredients</TableCell>

                <TableCell align="center">Status</TableCell>

                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orderRows.length > 0 ? (
                orderRows.map(({ order, item }) => {
                  const orderId = order?.Id ?? order?.id;

                  const status = order?.orderStatus || "—";

                  return (
                    <TableRow key={`${orderId}-${item.id}`}>
                      {/* ORDER ID */}
                      <TableCell className="restau-order-id">
                        #{orderId}
                      </TableCell>

                      {/* CUSTOMER */}
                      <TableCell>{order?.customer?.email || "—"}</TableCell>

                      {/* IMAGE */}
                      <TableCell>
                        {item?.food?.images?.[0] ? (
                          <img
                            src={item.food.images[0]}
                            alt={item?.food?.name || "Food"}
                            className="restau-food-image"
                          />
                        ) : (
                          <div className="restau-food-no-image">No Image</div>
                        )}
                      </TableCell>

                      {/* FOOD */}
                      <TableCell>{item?.food?.name || "—"}</TableCell>

                      {/* PRICE */}
                      <TableCell align="center" className="restau-order-price">
                        ₹{item?.totalPrice ?? item?.food?.price ?? 0}
                      </TableCell>

                      {/* INGREDIENTS */}
                      <TableCell>
                        {item?.ingredients?.length > 0
                          ? item.ingredients
                              .map(
                                (ingredient) => ingredient?.name || ingredient,
                              )
                              .join(", ")
                          : "—"}
                      </TableCell>

                      {/* STATUS */}
                      <TableCell align="center">
                        <Chip label={status} color={getStatusColor(status)} />
                      </TableCell>

                      {/* ACTION */}
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          className="restau-view-btn"
                          onClick={(event) =>
                            handleOpenStatusMenu(event, order)
                          }
                        >
                          Change Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* =========================
          STATUS MENU
      ========================= */}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseStatusMenu}
      >
        <MenuItem onClick={() => handleStatusChange("PENDING")}>
          Pending
        </MenuItem>

        <MenuItem onClick={() => handleStatusChange("OUT_FOR_DELIVERY")}>
          Out for Delivery
        </MenuItem>

        <MenuItem onClick={() => handleStatusChange("DELIVERED")}>
          Delivered
        </MenuItem>

        <MenuItem onClick={() => handleStatusChange("COMPLETED")}>
          Completed
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OrderTable;
