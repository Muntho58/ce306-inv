import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Avatar, Card } from "../components/ui";
import { Bars, Donut, GroupedBars } from "../components/charts";
import { categoryShare, customers, satisfaction } from "../data/seed";
import {
  calculateReportRevenue,
  getRevenueBuckets,
  getMostActiveCustomers,
  getCustomerOrderCount,
  formatNumber,
} from "../utils";

export default function Report() {
  const { orders } = useApp();
  const [range, setRange] = useState("month");

  const total = calculateReportRevenue(orders);
  const buckets = getRevenueBuckets(orders, range);
  const active = getMostActiveCustomers(customers, orders, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card title="Total sales revenue" action={
          <select aria-label="Report range" value={range} onChange={(e) => setRange(e.target.value)} className="rounded-full border border-neutral-300 px-3 py-2 text-sm">
            <option value="month">By month</option><option value="year">By year</option></select>}>
          <p className="mb-4 text-3xl font-bold text-brand">${formatNumber(total)}</p>
          <Bars data={Object.entries(buckets)} height={220} />
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Most active customers">
            <ul className="space-y-3">
              {active.map((c) => (
                <li key={c.id} className="flex items-center gap-3"><Avatar name={c.name} size="size-10" />
                  <div className="min-w-0 flex-1"><p className="font-medium">{c.name}</p><p className="truncate text-xs text-neutral-500">{c.email}</p></div>
                  <span className="text-sm text-neutral-500">{getCustomerOrderCount(orders, c.id)} orders</span></li>
              ))}
            </ul>
          </Card>
          <Card title="Satisfaction score">
            <div className="mb-3 flex gap-4 text-xs"><span><i className="mr-1 inline-block size-3 rounded bg-blue-500" />Enhancing service</span><span><i className="mr-1 inline-block size-3 rounded bg-green-500" />Overall satisfaction</span></div>
            <GroupedBars data={satisfaction} />
          </Card>
        </div>
      </div>
      <Card title="Customer favorites">
        <Donut data={categoryShare} center="945K" sub="Categories" />
        <ul className="mt-4 space-y-2">
          {categoryShare.map((c) => (
            <li key={c.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><i className="size-4 rounded" style={{ background: c.color }} />{c.label}</span><b>{c.value}%</b></li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
