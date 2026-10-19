// Utility functions for Report page
import { getSoldOrders } from "./dashboard";

export const calculateReportRevenue = (orders = []) => {
  const sold = getSoldOrders(orders);
  return sold.reduce((total, o) => total + (o.total || 0), 0);
};

export const getRevenueBuckets = (orders = [], range = "month") => {
  const sold = getSoldOrders(orders);
  const buckets = {};
  sold.forEach((o) => {
    const d = new Date(o.date);
    const key =
      range === "month"
        ? d.toLocaleString("en", { month: "short" })
        : String(d.getFullYear());
    buckets[key] = (buckets[key] || 0) + (o.total || 0);
  });
  return buckets;
};

export const getCustomerOrderCount = (orders = [], customerId) => {
  return orders.filter((o) => o.customerId === customerId).length;
};

export const getMostActiveCustomers = (customers = [], orders = [], limit = 4) => {
  return [...customers]
    .sort((a, b) => getCustomerOrderCount(orders, b.id) - getCustomerOrderCount(orders, a.id))
    .slice(0, limit);
};
