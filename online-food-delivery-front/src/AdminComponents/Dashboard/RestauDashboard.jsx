import React, { useEffect, useMemo, useState } from "react";
import {
  AttachMoney,
  CheckCircle,
  PendingActions,
  ShoppingBag,
  TrendingUp,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import "./RestauDashboard.css";
import { fetchRestaurantsOrder } from "../../components/State/Restaurant Order/Action";

const RestauDashboard = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const restaurant = useSelector((state) => state.restaurant.restaurant);

  const {
    orders = [],
    loading,
    error,
  } = useSelector((state) => state.restaurantOrder);

  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [restaurantError, setRestaurantError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!jwt) {
        setRestaurantError("Authentication required");
        setRestaurantLoading(false);
        return;
      }

      try {
        setRestaurantLoading(true);
        setRestaurantError("");

        const response = await fetch(
          "http://localhost:5000/api/admin/restaurants/user",
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant");
        }

        const data = await response.json();

        if (!data?.id) {
          throw new Error("Restaurant not found");
        }
        // console.log(data);
        dispatch(
          fetchRestaurantsOrder({
            restaurantId: data.id,
            orderStatus: "",
            jwt,
          }),
        );
      } catch (err) {
        // console.error("Dashboard restaurant error:", err);
        setRestaurantError(err.message || "Failed to load restaurant");
      } finally {
        setRestaurantLoading(false);
      }
    };

    fetchRestaurant();
  }, [dispatch, jwt]);

  const normalizedOrders = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      id: order?.Id ?? order?.id,
      status: String(order?.orderStatus || "").toUpperCase(),
      total: Number(order?.totalPrice ?? order?.totalAmount ?? 0),
    }));
  }, [orders]);

  const totalOrders = normalizedOrders.length;

  const totalRevenue = useMemo(() => {
    return normalizedOrders.reduce((sum, order) => sum + order.total, 0);
  }, [normalizedOrders]);

  const pendingOrders = useMemo(() => {
    return normalizedOrders
      .filter((order) => order.status === "PENDING")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [normalizedOrders]);

  const completedOrders = useMemo(() => {
    return normalizedOrders.filter((order) => order.status === "COMPLETED")
      .length;
  }, [normalizedOrders]);

  const chartData = useMemo(() => {
    const days = [];

    for (let index = 6; index >= 0; index--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - index);

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`;

      days.push({
        key,
        label: date.toLocaleDateString("en-IN", {
          weekday: "short",
        }),
        orders: 0,
        revenue: 0,
      });
    }

    normalizedOrders.forEach((order) => {
      if (!order.createdAt) {
        return;
      }

      const date = new Date(order.createdAt);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`;

      const day = days.find((item) => item.key === key);

      if (day) {
        day.orders += 1;
        day.revenue += order.total;
      }
    });

    return days;
  }, [normalizedOrders]);

  const maxOrders = Math.max(...chartData.map((item) => item.orders), 1);

  const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 1);

  if (restaurantLoading || loading) {
    return (
      <div className="restau-dashboard">
        <div className="dashboard-loading">
          <div className="dashboard-loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (restaurantError || error) {
    return (
      <div className="restau-dashboard">
        <div className="dashboard-error">
          <h2>Unable to load dashboard</h2>
          <p>
            {restaurantError || error?.message || "Failed to load dashboard"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="restau-dashboard">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Restaurant Dashboard</p>

          <h1 className="dashboard-title">
            {restaurant?.name || "Your Restaurant"}
          </h1>

          <p className="dashboard-subtitle">
            Overview of your restaurant's orders and revenue.
          </p>
        </div>

        <div className="dashboard-status">
          <span
            className={`status-dot ${
              restaurant?.open ? "status-open" : "status-closed"
            }`}
          ></span>

          <span>
            {restaurant?.open ? "Restaurant Open" : "Restaurant Closed"}
          </span>
        </div>
      </section>

      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="stat-icon orders-icon">
            <ShoppingBag />
          </div>

          <div className="stat-content">
            <p>Total Orders</p>
            <h2>{totalOrders}</h2>
            <span>All orders</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon revenue-icon">
            <AttachMoney />
          </div>

          <div className="stat-content">
            <p>Total Revenue</p>
            <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
            <span>From all orders</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon pending-icon">
            <PendingActions />
          </div>

          <div className="stat-content">
            <p>Pending Orders</p>
            <h2>{pendingOrders.length}</h2>
            <span>Need attention</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon completed-icon">
            <CheckCircle />
          </div>

          <div className="stat-content">
            <p>Completed Orders</p>
            <h2>{completedOrders}</h2>
            <span>Completed orders</span>
          </div>
        </div>
      </section>

      <section className="dashboard-pending-section">
        <div className="dashboard-section-header">
          <div>
            <p className="dashboard-section-label">Action Required</p>

            <h2>Pending Orders</h2>
          </div>

          <span className="pending-count">{pendingOrders.length}</span>
        </div>

        {pendingOrders.length > 0 ? (
          <div className="pending-orders-list">
            {pendingOrders.slice(0, 6).map((order) => (
              <div className="pending-order-card" key={order.id}>
                <div className="pending-order-main">
                  <div className="pending-order-icon">
                    <ShoppingBag />
                  </div>

                  <div className="pending-order-info">
                    <h3>Order #{order.id}</h3>

                    <p>{order?.customer?.fullname || "Customer"}</p>

                    <span>
                      {order?.items?.length || 0} item
                      {order?.items?.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <div className="pending-order-right">
                  <strong>₹{order.total.toLocaleString("en-IN")}</strong>

                  <span className="pending-badge">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-pending-orders">
            <CheckCircle />
            <h3>No pending orders</h3>
            <p>All current orders have been processed.</p>
          </div>
        )}
      </section>

      <section className="dashboard-chart-section">
        <div className="dashboard-section-header">
          <div>
            <p className="dashboard-section-label">Performance</p>

            <h2>Orders & Revenue</h2>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-orders"></i>
              Orders
            </span>

            <span>
              <i className="legend-revenue"></i>
              Revenue
            </span>
          </div>
        </div>

        <div className="dashboard-chart">
          <div className="chart-y-axis">
            <span>₹{maxRevenue.toLocaleString("en-IN")}</span>

            <span>
              ₹{Math.round(maxRevenue * 0.75).toLocaleString("en-IN")}
            </span>

            <span>₹{Math.round(maxRevenue * 0.5).toLocaleString("en-IN")}</span>

            <span>
              ₹{Math.round(maxRevenue * 0.25).toLocaleString("en-IN")}
            </span>

            <span>₹0</span>
          </div>

          <div className="chart-area">
            <div className="chart-grid">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="chart-bars">
              {chartData.map((item) => {
                const revenueHeight = (item.revenue / maxRevenue) * 100;

                const ordersHeight = (item.orders / maxOrders) * 100;

                return (
                  <div className="chart-column" key={item.key}>
                    <div className="chart-values">
                      <span className="chart-revenue-value">
                        ₹{item.revenue.toLocaleString("en-IN")}
                      </span>

                      <span className="chart-orders-value">{item.orders}</span>
                    </div>

                    <div className="chart-bars-wrapper">
                      <div
                        className="chart-revenue-bar"
                        style={{
                          height: `${revenueHeight}%`,
                        }}
                      ></div>

                      <div
                        className="chart-orders-bar"
                        style={{
                          height: `${ordersHeight}%`,
                        }}
                      ></div>
                    </div>

                    <span className="chart-label">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="chart-summary">
          <div>
            <TrendingUp />
            <span>Last 7 days</span>
          </div>

          <strong>
            ₹
            {chartData
              .reduce((sum, item) => sum + item.revenue, 0)
              .toLocaleString("en-IN")}
          </strong>
        </div>
      </section>
    </div>
  );
};

export default RestauDashboard;
