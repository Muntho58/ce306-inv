import { useState } from "react";
import { Link } from "react-router";
import { useApp, stockStats } from "../context/AppContext";
import { Card, ProductImage } from "../components/ui";
import { Bars } from "../components/charts";
import { demandByCategory } from "../data/seed";
import {
  formatMoney,
  calculateTotalRevenue,
  getRevenueByMonth,
  getProductOrderCounts,
  getTopProducts,
  getStockCards,
} from "../utils";

export default function Dashboard() {
  const { products, orders } = useApp();
  const topDemandCategories = Object.entries(demandByCategory)
    .map(([category, monthlyDemand], index) => ({
      category,
      monthlyDemand,
      totalDemand: monthlyDemand.reduce((total, [, value]) => total + value, 0),
      index,
    }))
    .sort((a, b) => b.totalDemand - a.totalDemand || a.index - b.index)
    .slice(0, 3);
  const [selectedDemandCategory, setSelectedDemandCategory] = useState(null);
  const activeDemandCategory = topDemandCategories.some(
    ({ category }) => category === selectedDemandCategory
  )
    ? selectedDemandCategory
    : topDemandCategories[0]?.category;
  const [selectedRevenueMonth, setSelectedRevenueMonth] = useState(null);

  const s = stockStats(products);
  const revenue = calculateTotalRevenue(orders);
  const byMonth = getRevenueByMonth(orders);
  const displayedRevenue = selectedRevenueMonth
    ? byMonth[selectedRevenueMonth]
    : revenue;
  const counts = getProductOrderCounts(orders);
  const top = getTopProducts(products, orders, 3);
  const stockCards = getStockCards(s);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Sales revenue" className="lg:col-span-2">
        <p className="text-4xl font-bold">{formatMoney(displayedRevenue)}</p>
        <p className="mb-4 text-sm text-neutral-500">
          {selectedRevenueMonth
            ? `Revenue for ${selectedRevenueMonth} (click again to show total)`
            : "Revenue from orders that were not returned (click a month to filter)"}
        </p>
        <Bars
          data={Object.entries(byMonth)}
          selected={selectedRevenueMonth}
          onSelect={(month) => setSelectedRevenueMonth((selected) => selected === month ? null : month)}
        />
      </Card>

      <div className="space-y-4">
        <div className="rounded-xl bg-brand p-5 text-white">
          <p className="text-3xl font-bold">{formatMoney(s.valuation)}</p>
          <p className="mt-1 font-semibold">Inventory valuation</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {stockCards.map(([label, n, bg]) => (
            <div key={label} className={`${bg} rounded-xl p-2 text-center`}>
              <p className="text-lg font-bold">{n}</p>
              <p className="text-[11px] font-semibold leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <Card title="Cost breakdown">
        <div className="grid grid-cols-3 gap-2 text-sm">
          {[["Earned", "$456.68", "from-green-100 to-green-500"], ["Spent", "$39.46", "from-indigo-100 to-indigo-500"], ["Saved", "$45.46", "from-red-100 to-red-400"]].map(([l, v, g]) => (
            <div key={l}><p className="text-neutral-500">{l}</p><p className="font-bold">{v}</p><div className={`mt-2 h-10 rounded-lg bg-gradient-to-r ${g}`} /></div>
          ))}
        </div>
      </Card>

      <Card title="Top market demand" className="lg:col-span-2"
        action={<div role="tablist" className="flex gap-1">{topDemandCategories.map(({ category }) => (
          <button key={category} role="tab" aria-selected={activeDemandCategory === category} onClick={() => setSelectedDemandCategory(category)}
            className={`rounded-full px-3 py-1 text-sm ${activeDemandCategory === category ? "bg-brand text-white" : "bg-neutral-100"}`}>{category}</button>))}</div>}>
        {activeDemandCategory && <Bars data={demandByCategory[activeDemandCategory]} height={160} />}
      </Card>

      <Card title="Top product recommendation" action={<Link to="/inventory" className="rounded-full border border-neutral-300 px-3 py-1 text-sm">View all</Link>} className="lg:col-span-3">
        <ul className="divide-y divide-neutral-200">
          {top.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <ProductImage src={p.image} name={p.name} size="size-10" />
                <div><p className="font-medium">{p.name}</p><p className="text-xs text-neutral-500">ID: {p.sku}</p></div>
              </div>
              <div className="text-right"><p className="font-semibold">${p.price}</p><p className="text-xs text-neutral-500">{counts[p.id] || 0} Orders</p></div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
