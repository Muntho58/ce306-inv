import { useState } from "react";
import { useApp } from "../context/AppContext";
import { customers } from "../data/seed";
import { Avatar, Badge, Card, PayText, Stat } from "../components/ui";
import {
  filterOrders,
  getOrderCountByStatus,
  calculateReturnLoss,
  findCustomerById,
  formatDate,
  formatTime,
} from "../utils";

const STATUSES = ["New Order", "Accepted", "Ready to ship", "Delivered", "Returned"];

export default function Orders() {
  const { orders, setOrderStatus } = useApp();
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  const rows = filterOrders(orders, filter);
  const count = (s) => getOrderCountByStatus(orders, s);
  const loss = calculateReturnLoss(orders);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Overall orders" value={orders.length} delta={12.08} />
        <Stat label="Processed" value={count("Accepted")} delta={24.09} active />
        <Stat label="Delivered" value={count("Delivered")} delta={30.12} />
        <Stat label="Return loss" value={`${loss} USD`} delta={-10.3} />
      </div>
      <Card title="All orders" action={
        <select aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-full border border-neutral-300 px-3 py-2 text-sm">
          <option>All</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>}>
        {error && <p role="alert" className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-brand"><tr>{["Order ID", "Customer", "Order date", "Payment", "Status", "Change status"].map((h) => <th key={h} className="pb-3 pr-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((o) => {
                const c = findCustomerById(customers, o.customerId);
                return (
                  <tr key={o.id} className="border-t border-neutral-200">
                    <td className="py-3 pr-3 font-semibold">{o.id}</td>
                    <td className="pr-3"><div className="flex items-center gap-2"><Avatar name={c.name} /><div><p className="font-medium">{c.name}</p><p className="text-xs text-neutral-500">{c.email}</p></div></div></td>
                    <td className="pr-3">{formatDate(o.date)}<p className="text-xs text-neutral-500">{formatTime(o.date)}</p></td>
                    <td className="pr-3">${o.total.toFixed(2)}<br /><PayText>{o.payment}</PayText></td>
                    <td className="pr-3"><Badge>{o.status}</Badge></td>
                    <td>
                      <select aria-label={`Status of ${o.id}`} value={o.status} onChange={(e) => setError(setOrderStatus(o.id, e.target.value) || "")}
                        className="rounded border border-neutral-300 px-2 py-1">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-neutral-500">No orders with this status yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
