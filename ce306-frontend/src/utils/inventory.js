// Utility functions for Inventory page

export const filterProducts = (products = [], category = "All", query = "") => {
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    const matchesCat = category === "All" || p.category === category;
    const matchesQuery = !q || (p.name + " " + p.sku).toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });
};

export const getCategoryProductCount = (products = [], category) => {
  return products.filter((p) => p.category === category).length;
};

export const getTopCategory = (categories = [], products = []) => {
  if (categories.length === 0) return "-";
  return categories
    .map((c) => [c, getCategoryProductCount(products, c)])
    .sort((a, b) => b[1] - a[1])[0][0];
};
