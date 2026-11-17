import { createContext, useContext, useEffect, useState } from "react";
import {
  getOrders,
  getProducts,
  saveProduct as saveProductRequest,
  updateOrderStatus,
} from "../api";

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
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => localStorage.setItem("inv_auth", JSON.stringify(loggedIn)), [loggedIn]);
  useEffect(() => localStorage.setItem("inv_user", JSON.stringify(user)), [user]);

  const refreshData = async () => {
    setDataLoading(true);
    setDataError("");
    try {
      const [productList, orderList] = await Promise.all([getProducts(), getOrders()]);
      setProducts(productList);
      setOrders(orderList);
      return true;
    } catch (error) {
      setDataError(error.message);
      return false;
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => { refreshData(); }, []);

  const login = (email, password) => {
    if (email === "admin@example.com" && password === "admin123") { setLoggedIn(true); return null; }
    return "Wrong email or password";
  };
  const logout = () => setLoggedIn(false);

  const saveProduct = async (product) => {
    const savedProduct = await saveProductRequest(product);
    setProducts((list) => product.id
      ? list.map((item) => item.id === savedProduct.id ? savedProduct : item)
      : [savedProduct, ...list]);
  };

  const setOrderStatus = async (orderId, status) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === status) return;

    await updateOrderStatus(orderId, status);
    setOrders((list) => list.map((item) => item.id === orderId ? { ...item, status } : item));

    let stockChange = 0;
    if (order.status === "New Order" && status === "Accepted") stockChange = -1;
    if (status === "Returned" && order.status !== "Returned") stockChange = 1;
    if (stockChange) {
      setProducts((list) => list.map((product) => {
        const item = order.items.find((orderItem) => orderItem.productId === product.id);
        return item ? { ...product, currentStock: product.currentStock + stockChange * item.qty } : product;
      }));
    }
  };

  const resetData = refreshData;

  return (
    <Ctx.Provider value={{
      loggedIn, user, setUser, products, orders, dataLoading, dataError, refreshData,
      query, setQuery, login, logout, saveProduct, setOrderStatus, resetData,
    }}>
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
