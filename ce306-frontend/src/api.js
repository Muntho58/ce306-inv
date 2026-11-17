async function request(path, options) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
  }
  return result;
}

export const getProducts = () => request("/api/products");
export const getOrders = () => request("/api/orders");

export const saveProduct = (product) =>
  request("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });

export const updateOrderStatus = (id, status) =>
  request(`/api/orders/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
