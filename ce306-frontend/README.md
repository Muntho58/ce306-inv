# CE306 Inventory Management (Frontend mini project)

React + React Router v7 + Tailwind CSS v4 (Vite). No backend: mock data lives in `src/data/seed.js`,
and changes are saved to the browser's localStorage.

## Run
    npm install
    npm run dev      # http://localhost:5173

Login: admin@example.com / admin123

## Features
- Login (mock) + protected routes
- Dashboard: valuation, stock levels, revenue chart, market demand tabs, top products
- Inventory: search (header), category filter, add / update product
- Orders: status filter, change status (Accepted deducts stock, Returned restores it)
- Report: revenue by month/year, donut chart, active customers, satisfaction chart
- Settings: profile, password toggle, picture upload, notifications
