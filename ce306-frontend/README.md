# CE306 Inventory Management (Frontend mini project)

React + React Router v7 + Tailwind CSS v4 (Vite). No backend: mock data lives in `src/data/seed.js`,
and changes are saved to the browser's localStorage.

## PostgreSQL database
SQL files for creating a PostgreSQL database and its inventory tables are in the repository's
`database` folder. In pgAdmin, run `database/01_create_database.sql` once while connected to a
server, then connect to the new `ce306_inventory` database and run `database/02_schema.sql`.
This prepares the schema only; the frontend still uses localStorage until a backend is added.

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
