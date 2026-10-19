import { createContext, useContext, useEffect, useState } from "react";
import { seedProducts, seedOrders } from "../data/seed";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const DEFAULT_USER = { name: "Kira Yamato", email: "admin@example.com", avatar: "", notifications: { email: true, sms: false } };

export function AppProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(() => load("inv_auth", false));
  const [user, setUser] = useState(() => load("inv_user", DEFAULT_USER));
  const [products, setProducts] = useState(() => load("inv_products", seedProducts));
  const [orders, setOrders] = useState(() => load("inv_orders", seedOrders));
  const [query, setQuery] = useState("");

  useEffect(() => localStorage.setItem("inv_auth", JSON.stringify(loggedIn)), [loggedIn]);
  useEffect(() => localStorage.setItem("inv_user", JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem("inv_products", JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem("inv_orders", JSON.stringify(orders)), [orders]);

  const login = (email, password) => {
    if (email === "admin@example.com" && password === "admin123") { setLoggedIn(true); return null; }
    return "Wrong email or password";
  };
  const logout = () => setLoggedIn(false);

  const saveProduct = (p) =>
    setProducts((list) => p.id
      ? list.map((x) => (x.id === p.id ? { ...x, ...p } : x))
      : [{ ...p, id: Date.now(), totalSales: 0, status: "Active" }, ...list]);

  // Accepted deducts stock, Returned restores it
  const setOrderStatus = (orderId, status) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === status) return null;
    const delta = (sign) => setProducts((list) => list.map((p) => {
      const it = order.items.find((i) => i.productId === p.id);
      return it ? { ...p, currentStock: Math.max(0, p.currentStock + sign * it.qty) } : p;
    }));
    if (order.status === "New Order" && status === "Accepted") {
      const short = order.items.some((i) => (products.find((p) => p.id === i.productId)?.currentStock ?? 0) < i.qty);
      if (short) return "Not enough stock to accept this order";
      delta(-1);
    }
    if (status === "Returned" && order.status !== "Returned") delta(+1);
    setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status } : o)));
    return null;
  };

  const resetData = () => { setProducts(seedProducts); setOrders(seedOrders); };

  return (
    <Ctx.Provider value={{ loggedIn, user, setUser, products, orders, query, setQuery, login, logout, saveProduct, setOrderStatus, resetData }}>
      {children}
    </Ctx.Provider>
  );
}

export function stockStats(products) {
  const active = products;
  return {
    inStock: active.filter((p) => p.currentStock > 0).length,
    low: active.filter((p) => p.currentStock > 0 && p.currentStock <= 20).length,
    out: active.filter((p) => p.currentStock === 0).length,
    dead: active.filter((p) => p.currentStock > 0 && p.totalSales < 150).length,
    valuation: active.reduce((s, p) => s + p.currentStock * p.price, 0),
  };
}
