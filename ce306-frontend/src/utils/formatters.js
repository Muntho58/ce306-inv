// Utility functions for formatting values (currency, date, time, numbers)

export const formatMoney = (amount, maxFractionDigits = 0) => {
  return "$" + Number(amount || 0).toLocaleString(undefined, {
    maximumFractionDigits: maxFractionDigits,
  });
};

export const formatNumber = (num) => {
  return Number(num || 0).toLocaleString();
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
