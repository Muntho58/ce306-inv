export const categories = ["Perfume", "Accessories", "Fashion", "House Decor", "Electronics"];

export const seedProducts = [
  { id: 1, sku: "RT15246630", name: "Blossom mist soft rose", category: "Perfume", currentStock: 12, predictedStock: 100, price: 45, status: "Active", totalSales: 9856, image: "/products/perfume.svg" },
  { id: 2, sku: "RT15246540", name: "Classic leather chrono", category: "Accessories", currentStock: 150, predictedStock: 450, price: 120, status: "Active", totalSales: 495, image: "/products/chrono.svg" },
  { id: 3, sku: "RT15249828", name: "Chromium bag", category: "Fashion", currentStock: 129, predictedStock: 189, price: 80, status: "Active", totalSales: 7890, image: "/products/bag.svg" },
  { id: 4, sku: "RT15244830", name: "Sofa coco single", category: "House Decor", currentStock: 65, predictedStock: 88, price: 300, status: "Active", totalSales: 125, image: "/products/sofa.svg" },
  { id: 5, sku: "RT15243690", name: "Golden bracelet plated", category: "Accessories", currentStock: 0, predictedStock: 60, price: 65, status: "Active", totalSales: 310, image: "/products/bracelet.svg" },
  { id: 6, sku: "RT15243790", name: "Mechanical keyboard 80", category: "Electronics", currentStock: 8, predictedStock: 40, price: 199.99, status: "Inactive", totalSales: 220, image: "/products/keyboard.svg" },
];

export const customers = [
  { id: 1, name: "Hiiro Yui", email: "HiiroYui@gmail.com" },
  { id: 2, name: "David Martinez", email: "Davidmartinez@gmail.com" },
  { id: 3, name: "Athrun Zala", email: "Athrun.Zala@gmail.com" },
  { id: 4, name: "Setsuna F. Seiei", email: "Setsuna@gmail.com" },
  { id: 5, name: "Lucyna Kushinada", email: "LucynaKushinada@gmail.com" },
];

export const seedOrders = [
  { id: "#ODR115753", customerId: 1, date: "2026-02-08T11:13:30", total: 130, payment: "Paid", status: "Accepted", items: [{ productId: 3, qty: 1 }] },
  { id: "#ODR114586", customerId: 2, date: "2026-05-10T10:30:00", total: 200, payment: "Paid", status: "New Order", items: [{ productId: 2, qty: 1 }] },
  { id: "#ODR119875", customerId: 3, date: "2026-04-27T11:00:00", total: 26, payment: "Paid", status: "Ready to ship", items: [{ productId: 1, qty: 1 }] },
  { id: "#ODR113389", customerId: 4, date: "2026-04-29T14:00:00", total: 350, payment: "Pending", status: "Delivered", items: [{ productId: 4, qty: 1 }] },
  { id: "#ODR115544", customerId: 5, date: "2026-05-04T19:30:00", total: 260, payment: "Unpaid", status: "Returned", items: [{ productId: 3, qty: 3 }] },
];

export const demandByCategory = {
  Fashion: [["Jan", 40], ["Feb", 90], ["Mar", 45], ["Apr", 65], ["May", 75]],
  Shoes: [["Jan", 30], ["Feb", 50], ["Mar", 80], ["Apr", 55], ["May", 60]],
  Electronics: [["Jan", 60], ["Feb", 40], ["Mar", 70], ["Apr", 85], ["May", 50]],
};

export const categoryShare = [
  { label: "Fashion", value: 65, color: "#1d6fe8" },
  { label: "Electronics", value: 15, color: "#2ecc55" },
  { label: "Home & Living", value: 30, color: "#6b6bff" },
];

export const satisfaction = [
  { label: "Jan", a: 60, b: 80 }, { label: "Feb", a: 25, b: 105 },
  { label: "Mar", a: 80, b: 45 }, { label: "Apr", a: 80, b: 68 },
];
