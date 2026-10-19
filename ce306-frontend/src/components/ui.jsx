import { useEffect } from "react";

export const Card = ({ title, action, children, className = "" }) => (
  <section className={`rounded-xl bg-white p-5 ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="border-l-2 border-brand pl-2 text-base font-semibold">{title}</h2>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const Stat = ({ label, value, delta, active }) => (
  <div className={`rounded-xl p-5 ${active ? "bg-brand text-white" : "bg-white"}`}>
    <p className={`text-sm ${active ? "text-white/80" : "text-neutral-500"}`}>{label}</p>
    <div className="mt-2 flex items-center gap-2">
      <p className="text-2xl font-bold">{value}</p>
      {delta !== undefined && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${delta >= 0 ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
        </span>
      )}
    </div>
  </div>
);

const tone = {
  Active: "bg-green-100 text-green-700 border-green-500", Paid: "text-green-600", Pending: "text-amber-500", Unpaid: "text-red-600",
  Accepted: "bg-green-100 text-green-700 border-green-500", "New Order": "bg-indigo-100 text-indigo-700 border-indigo-400",
  "Ready to ship": "bg-cyan-100 text-cyan-700 border-cyan-400", Delivered: "bg-neutral-200 text-neutral-700 border-neutral-400",
  Returned: "bg-red-100 text-red-600 border-red-400", Inactive: "bg-neutral-200 text-neutral-600 border-neutral-400",
};
export const Badge = ({ children }) => (
  <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${tone[children] || ""}`}>{children}</span>
);
export const PayText = ({ children }) => <span className={`text-xs font-medium ${tone[children]}`}>({children})</span>;

export const Avatar = ({ name, src, size = "size-9" }) =>
  src ? <img src={src} alt="" className={`${size} rounded-full object-cover`} /> : (
    <span className={`${size} grid shrink-0 place-items-center rounded-full bg-navy text-sm font-semibold text-white`}>{name?.[0]}</span>
  );

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-black/40 p-4" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-6" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-xl text-neutral-500">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const field = "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none";
export const Toggle = ({ checked, onChange, label }) => (
  <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
    className={`h-7 w-12 rounded-full p-1 transition-colors ${checked ? "bg-brand" : "bg-neutral-300"}`}>
    <span className={`block size-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
  </button>
);
