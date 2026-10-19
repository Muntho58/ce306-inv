import { NavLink, Navigate, Outlet, useLocation } from "react-router";
import { useApp } from "../context/AppContext";
import { Avatar } from "./ui";
import {
  DashboardIcon,
  InventoryIcon,
  OrdersIcon,
  ReportIcon,
  SettingsIcon,
  LogoutIcon,
} from "./icons";

const menu = [
  { to: "/", label: "Dashboard", icon: DashboardIcon },
  { to: "/inventory", label: "Inventory", icon: InventoryIcon },
  { to: "/orders", label: "Orders", icon: OrdersIcon },
  { to: "/report", label: "Report", icon: ReportIcon },
];
const titles = { "/": "My Dashboard", "/inventory": "Overall Inventory", "/orders": "Orders", "/report": "Report", "/settings": "Settings" };
const link = ({ isActive }) =>
  `flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition-colors ${isActive ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`;

export default function Layout() {
  const { loggedIn, user, logout, query, setQuery } = useApp();
  const { pathname } = useLocation();
  if (!loggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen flex-col gap-4 p-4 md:flex-row">
      <aside className="flex shrink-0 flex-col rounded-xl bg-navy p-4 text-white md:w-60">
        <p className="mb-2 px-5 text-sm font-semibold">Menu</p>
        <nav className="flex flex-row flex-wrap gap-1 md:flex-col">
          {menu.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink key={m.to} to={m.to} end={m.to === "/"} className={link}>
                <Icon className="size-5 shrink-0" />
                <span>{m.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <p className="mb-2 mt-6 px-5 text-sm font-semibold">Tools</p>
        <NavLink to="/settings" className={link}>
          <SettingsIcon className="size-5 shrink-0" />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-full px-5 py-3 text-left text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogoutIcon className="size-5 shrink-0" />
          <span>Log out</span>
        </button>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-5 py-3">
          <h1 className="text-xl font-bold">{titles[pathname] ?? "Inventory"}</h1>
          <div className="flex items-center gap-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products"
              aria-label="Search products" className="w-52 rounded-full border border-neutral-300 px-4 py-2 text-sm" />
            <Avatar name={user.name} src={user.avatar} size="size-10" />
            <div className="hidden text-sm sm:block"><p className="font-semibold">{user.name}</p><p className="text-neutral-500">{user.email}</p></div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
