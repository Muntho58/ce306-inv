// Utility functions for Orders page

export const filterOrders = (orders = [], status = "All") => {
  return orders.filter((o) => status === "All" || o.status === status);
};

export const getOrderCountByStatus = (orders = [], status) => {
  return orders.filter((o) => o.status === status).length;
};

export const calculateReturnLoss = (orders = []) => {
  return orders
    .filter((o) => o.status === "Returned")
    .reduce((total, o) => total + (o.total || 0), 0);
};

export const findCustomerById = (customers = [], id) => {
  return customers.find((c) => c.id === id) || { name: "Unknown", email: "" };
};

