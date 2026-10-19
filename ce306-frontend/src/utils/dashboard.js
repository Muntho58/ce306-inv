// Utility functions for Dashboard page

export const getSoldOrders = (orders = []) => {
  return orders.filter((o) => o.status !== "Returned");
};

export const calculateTotalRevenue = (orders = []) => {
  const sold = getSoldOrders(orders);
  return sold.reduce((total, o) => total + (o.total || 0), 0);
};

export const getRevenueByMonth = (orders = []) => {
  const sold = getSoldOrders(orders);
  const byMonth = {};
  sold.forEach((o) => {
    const m = new Date(o.date).toLocaleString("en", { month: "short" });
    byMonth[m] = (byMonth[m] || 0) + o.total;
  });
  return byMonth;
};

export const getProductOrderCounts = (orders = []) => {
  const counts = {};
  orders.forEach((o) => {
    o.items?.forEach((i) => {
      counts[i.productId] = (counts[i.productId] || 0) + i.qty;
    });
  });
  return counts;
};

export const getTopProducts = (products = [], orders = [], limit = 3) => {
  const counts = getProductOrderCounts(orders);
  return [...products]
    .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
    .slice(0, limit);
};

export const getStockCards = (stats = {}) => [
  ["In stock", stats.inStock ?? 0, "bg-green-500"],
  ["Low stock", stats.low ?? 0, "bg-indigo-400"],
  ["Out of stock", stats.out ?? 0, "bg-red-500"],
  ["Dead stock", stats.dead ?? 0, "bg-neutral-300"],
];
