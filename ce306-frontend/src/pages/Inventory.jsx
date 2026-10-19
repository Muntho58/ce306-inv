import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Badge, Card, Modal, Stat, field } from "../components/ui";
import { categories } from "../data/seed";
import { filterProducts, getTopCategory, formatNumber } from "../utils";

const empty = { name: "", sku: "", category: categories[0], currentStock: 0, predictedStock: 0, price: 0 };

function ProductForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const num = (k) => (e) => setF({ ...f, [k]: Math.max(0, Number(e.target.value)) });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...f, name: f.name.trim(), sku: f.sku.trim() }); }} className="space-y-3">
      <label className="block text-sm">Product name<input required className={`${field} mt-1`} value={f.name} onChange={set("name")} /></label>
      <label className="block text-sm">SKU<input required className={`${field} mt-1`} value={f.sku} onChange={set("sku")} placeholder="RT15246630" /></label>
      <label className="block text-sm">Category
        <select className={`${field} mt-1`} value={f.category} onChange={set("category")}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
      </label>
      <div className="grid grid-cols-3 gap-2">
        <label className="block text-sm">Current<input type="number" min="0" className={`${field} mt-1`} value={f.currentStock} onChange={num("currentStock")} /></label>
        <label className="block text-sm">Predicted<input type="number" min="0" className={`${field} mt-1`} value={f.predictedStock} onChange={num("predictedStock")} /></label>
        <label className="block text-sm">Price ($)<input type="number" min="0" step="0.01" className={`${field} mt-1`} value={f.price} onChange={num("price")} /></label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="rounded-full border border-neutral-300 px-5 py-2 text-sm">Cancel</button>
        <button className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white">Save product</button>
      </div>
    </form>
  );
}

export default function Inventory() {
  const { products, query, saveProduct } = useApp();
  const [cat, setCat] = useState("All");
  const [editing, setEditing] = useState(null);

  const rows = filterProducts(products, cat, query);
  const topCategory = getTopCategory(categories, products);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total products" value={products.length} />
        <Stat label="Categories" value={categories.length} />
        <Stat label="Top category" value={topCategory} />
      </div>
      <Card title="Predictive product inventory"
        action={<div className="flex gap-2">
          <select aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-full border border-neutral-300 px-3 py-2 text-sm">
            <option>All</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          <button onClick={() => setEditing(empty)} className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white">Add product</button>
        </div>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-brand"><tr>{["Product", "Category", "Current inventory", "Predictive inventory", "Total sales", "Status", ""].map((h) => <th key={h} className="pb-3 pr-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-neutral-200">
                  <td className="py-3 pr-3"><p className="font-medium">{p.name}</p><p className="text-xs text-neutral-500">ID: {p.sku}</p></td>
                  <td className="pr-3">{p.category}</td>
                  <td className={`pr-3 ${p.currentStock === 0 ? "font-semibold text-red-600" : ""}`}>{p.currentStock} Boxes</td>
                  <td className="pr-3">{p.predictedStock} Boxes</td>
                  <td className="pr-3">{formatNumber(p.totalSales)}</td>
                  <td className="pr-3"><Badge>{p.status}</Badge></td>
                  <td><button onClick={() => setEditing(p)} className="font-medium hover:text-brand">Update</button></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-neutral-500">No products match. Clear the search or add a new product.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      {editing && (
        <Modal title={editing.id ? "Update product" : "Add product"} onClose={() => setEditing(null)}>
          <ProductForm initial={editing} onClose={() => setEditing(null)} onSave={(p) => { saveProduct(p); setEditing(null); }} />
        </Modal>
      )}
    </div>
  );
}
